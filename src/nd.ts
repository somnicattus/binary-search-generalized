type Vector = readonly unknown[];
type ComponentIndices<T extends Vector> = keyof T & number;
export type Predicate<T extends Vector> = (vector: T) => boolean;
type _Midpoint<
	T extends Vector,
	U extends Vector = T,
	A extends unknown[] = [],
> = number extends T["length"]
	? readonly ((always: T[number], never: T[number]) => T[number])[]
	: U extends readonly [infer F, ...infer R extends unknown[]]
		? _Midpoint<T, R, [...A, (always: F, never: F) => F]>
		: A;
export type Midpoint<T extends Vector> = _Midpoint<T>;
type _ShouldContinue<
	T extends Vector,
	U extends Vector = T,
	A extends unknown[] = [],
> = number extends T["length"]
	? readonly ((always: T[number], never: T[number]) => boolean)[]
	: U extends readonly [infer F, ...infer R extends unknown[]]
		? _ShouldContinue<T, R, [...A, (always: F, never: F) => boolean]>
		: A;
export type ShouldContinue<T extends Vector> = _ShouldContinue<T>;
type Division<T extends Vector> = {
	readonly always: T;
	readonly never: T;
};

const createShouldContinue =
	<T extends Vector>(shouldContinue: ShouldContinue<T>) =>
	(division: Division<T>, components: Set<ComponentIndices<T>>) => {
		const { always, never } = division;
		const result = new Set<ComponentIndices<T>>();
		for (const i of components) {
			// Activate component i if shouldContinue[i] returns true (false means component i has converged sufficiently)
			// biome-ignore lint/style/noNonNullAssertion: i is always valid index
			if (shouldContinue[i]!(always[i], never[i])) {
				result.add(i);
			}
		}
		return result;
	};

const createMidpoint =
	<T extends Vector>(midpoint: Midpoint<T>) =>
	(division: Division<T>, components: Set<ComponentIndices<T>>) => {
		const { always, never } = division;
		return midpoint.map((fn, i) =>
			// Apply the midpoint function only to active components
			components.has(i as ComponentIndices<T>)
				? fn(always[i], never[i])
				: always[i],
		) as unknown as T;
	};

/** Array.prototype.with */
const vectorWith = <T extends Vector>(
	vector: T,
	index: ComponentIndices<T>,
	value: T[typeof index],
): T => {
	const result = vector.slice() as unknown as T;
	result[index] = value;
	return result;
};

const createDivide = <T extends Vector>(predicate: Predicate<T>) => {
	const divide = function* (
		forward: T,
		backward: T,
		mid: T,
		result: boolean,
		components: ReadonlySet<ComponentIndices<T>>,
	): Generator<Division<T>> {
		// Division with no omit must include boundary
		yield result
			? { always: mid, never: forward }
			: { always: forward, never: mid };
		const _components = new Set<ComponentIndices<T>>(components);
		// Track all divisions with some omitted components
		for (const i of _components) {
			_components.delete(i);

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
			yield* divide(omitted, backward, counter, result, _components);
		}
	};
	return divide;
};

const createDfsBinarySearch = <T extends Vector>(
	predicate: Predicate<T>,
	divide: ReturnType<typeof createDivide<T>>,
	midpoint: ReturnType<typeof createMidpoint<T>>,
	shouldContinue: ReturnType<typeof createShouldContinue<T>>,
) => {
	const dfsBinarySearch = function* (
		division: Division<T>,
		components: Set<ComponentIndices<T>>,
	): Generator<T> {
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

/**
 * Enumerate inside-border grid points of a monotone region in N dimensions.
 *
 * Notes:
 * - The generator does not mutate values after yielding them. However, yielded vectors are
 *   part of the traversal state and are intended to be treated as immutable by callers. If you
 *   want to modify or store them safely, make a copy first (e.g., `[...v]` for primitives, or clone deeply if the values are object).
 * - `midpoint` and `shouldContinue` must have the same length as the input vectors and should
 *   be designed together to ensure convergence (e.g., integer midpoint with gap-based termination).
 *
 * @typeParam T - A readonly tuple/array type representing a vector in D dimensions.
 * @param alwaysEnd A vector that definitely satisfies the predicate (inside/true corner).
 * @param neverEnd A vector that definitely does not satisfy the predicate (outside/false corner).
 * @param predicate Monotone decision function across the hyper-rectangle from `alwaysEnd` to `neverEnd`.
 * @param midpoint Per-dimension midpoint functions; only applied to still-active dimensions.
 * @param shouldContinue Per-dimension continuation predicates; a dimension deactivates when this returns false.
 * @returns A generator yielding vectors on the inside border; output order is not guaranteed.
 */
export const ndBinarySearch = <T extends Vector>(
	alwaysEnd: T,
	neverEnd: T,
	predicate: Predicate<T>,
	midpoint: Midpoint<T>,
	shouldContinue: ShouldContinue<T>,
): Generator<T> => {
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
	const components = new Set<ComponentIndices<T>>(
		Array.from(alwaysEnd, (_, i) => i as ComponentIndices<T>),
	);
	return dfsBinarySearch({ always: alwaysEnd, never: neverEnd }, components);
};
