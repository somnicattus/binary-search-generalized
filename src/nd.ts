import type { FixedLengthArray } from "type-fest";

export type Vector<D extends number, T> = FixedLengthArray<T, D>;
export type ReadonlyVector<D extends number, T> = Readonly<Vector<D, T>>;
export type Predicate<D extends number, T> = (
	vector: ReadonlyVector<D, T>,
) => boolean;
export type Midpoint<D extends number, T> = FixedLengthArray<
	(always: T, never: T) => T,
	D
>;
export type ShouldContinue<D extends number, T> = FixedLengthArray<
	(always: T, never: T) => boolean,
	D
>;

const createShouldContinue =
	<D extends number, T>(shouldContinue: ShouldContinue<D, T>) =>
	(division: Division<D, T>, components: Set<D>) => {
		const { always, never } = division;
		const result = new Set<D>();
		for (const i of components) {
			// Activate component i if shouldContinue[i] returns true (false means component i has converged sufficiently)
			// biome-ignore lint/style/noNonNullAssertion: i is always valid index
			if (shouldContinue[i]!(always[i]!, never[i]!)) {
				result.add(i);
			}
		}
		return result;
	};

const createMidpoint =
	<D extends number, T>(midpoint: Midpoint<D, T>) =>
	(division: Division<D, T>, components: Set<D>) => {
		const { always, never } = division;
		return midpoint.map((fn, i) =>
			// Apply the midpoint function only to active components
			// biome-ignore lint/style/noNonNullAssertion: i is always valid index
			components.has(i as D) ? fn(always[i]!, never[i]!) : always[i]!,
		) as unknown as Vector<D, T>;
	};

type Division<D extends number, T> = {
	readonly always: ReadonlyVector<D, T>;
	readonly never: ReadonlyVector<D, T>;
};

/** Array.prototype.with */
const vectorWith = <D extends number, T>(
	vector1: ReadonlyVector<D, T>,
	index: D,
	value: T,
): Vector<D, T> => {
	const result = vector1.slice() as unknown as Vector<D, T>;
	result[index] = value;
	return result;
};

const createDivide = <D extends number, T>(predicate: Predicate<D, T>) => {
	const divide = function* (
		forward: ReadonlyVector<D, T>,
		backward: ReadonlyVector<D, T>,
		mid: ReadonlyVector<D, T>,
		result: boolean,
		components: ReadonlySet<D>,
		done: ReadonlySet<D> = new Set(),
	): Generator<Division<D, T>> {
		// Division with no omit must include boundary
		yield result
			? { always: mid, never: forward }
			: { always: forward, never: mid };
		const _done = new Set<D>(done);
		// Track all divisions with some omitted components
		for (const i of components) {
			if (_done.has(i)) continue;
			_done.add(i);

			// Check whether the result changes between "mid" and "omitted" forward
			const omitted = vectorWith(forward, i, mid[i]);
			if (predicate(omitted) === result) {
				// If not, skip this and subsequent divisions:
				// this combination of omitted components makes a boundary-including division impossible.
				continue;
			}
			const counter = vectorWith(mid, i, backward[i]);

			// If the result changes, yield this division.
			// Subsequent divisions may include the boundary.
			yield* divide(omitted, backward, counter, result, components, _done);
		}
	};
	return divide;
};

const createDfsBinarySearch = <D extends number, T>(
	predicate: Predicate<D, T>,
	divide: ReturnType<typeof createDivide<D, T>>,
	midpoint: (division: Division<D, T>, components: Set<D>) => Vector<D, T>,
	shouldContinue: (division: Division<D, T>, components: Set<D>) => Set<D>,
) => {
	const dfsBinarySearch = function* (
		division: Division<D, T>,
		components: Set<D>,
	): Generator<Vector<D, T>> {
		const _components = shouldContinue(division, components);
		if (_components.size === 0) {
			yield division.always;
			return;
		}

		const mid = midpoint(division, _components);
		const result = predicate(mid);

		const forward = result ? division.never : division.always;
		const backward = result ? division.always : division.never;

		const divisions = divide(forward, backward, mid, result, _components);

		for (const division of divisions) {
			yield* dfsBinarySearch(division, _components);
		}
	};

	return dfsBinarySearch;
};

export const ndBinarySearch = function* <D extends number, T>(
	alwaysEnd: ReadonlyVector<D, T>,
	neverEnd: ReadonlyVector<D, T>,
	predicate: Predicate<D, T>,
	midpoint: Midpoint<D, T>,
	shouldContinue: ShouldContinue<D, T>,
) {
	if (
		alwaysEnd.length !== neverEnd.length ||
		neverEnd.length !== midpoint.length ||
		midpoint.length !== shouldContinue.length
	) {
		throw new Error("All input vectors must have the same length");
	}
	const divide = createDivide(predicate);
	const m = createMidpoint(midpoint);
	const c = createShouldContinue(shouldContinue);
	const dfsBinarySearch = createDfsBinarySearch(predicate, divide, m, c);
	const components = new Set<D>(Array.from(alwaysEnd, (_, i) => i as D));
	yield* dfsBinarySearch({ always: alwaysEnd, never: neverEnd }, components);
};
