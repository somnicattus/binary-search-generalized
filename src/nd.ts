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

const createContext = <
	D extends number,
	T,
	P extends (vector: NoInfer<Vector<D, T>>) => boolean,
>(
	predicate: P,
	midpoint: FixedLengthArray<(always: T, never: T) => T, D>,
	shouldContinue: FixedLengthArray<(always: T, never: T) => boolean, D>,
) => {
	if (midpoint.length !== shouldContinue.length) {
		throw new Error("midpoint and shouldContinue must have the same length");
	}
	const length = midpoint.length;
	/** Active components */
	const d = Array.from({ length }, () => true);

	const _continue = (
		always: ReadonlyVector<D, T>,
		never: ReadonlyVector<D, T>,
	) => {
		let result = 0;
		for (let i = 0; i < length; i++) {
			if (!d[i]) continue;
			if (shouldContinue[i](always[i], never[i])) {
				result++;
			} else {
				// Deactivate component i if shouldContinue[i] is false (enough converged against component i)
				d[i] = false;
			}
		}
		// Continue while active components exist
		return result;
	};

	const _midpoint = (
		always: ReadonlyVector<D, T>,
		never: ReadonlyVector<D, T>,
	) =>
		midpoint.map((fn, i) =>
			// Apply the midpoint function only to active components
			d[i] ? fn(always[i], never[i]) : always[i],
		) as unknown as Vector<D, T>;

	return {
		/** predicate */
		p: predicate,
		/** continue */
		c: _continue,
		/** midpoint */
		m: _midpoint as (
			always: ReadonlyVector<D, T>,
			never: ReadonlyVector<D, T>,
		) => Vector<D, T>,
		/**
		 * array of active components.
		 * `c: continue` mutates activation.
		 * must be reset after recursive calls.
		 */
		d,
	} as const;
};

type Context<
	D extends number,
	T,
	P extends (vector: ReadonlyVector<D, T>) => boolean,
> = ReturnType<typeof createContext<D, T, P>>;

type Division<D extends number, T> = {
	readonly always: ReadonlyVector<D, T>;
	readonly never: ReadonlyVector<D, T>;
};

/** Array.prototype.with */
const vectorWith = <D extends number, T>(
	vector: ReadonlyVector<D, T>,
	index: number,
	value: T,
): Vector<D, T> => {
	const result = vector.slice() as unknown as Vector<D, T>;
	result[index] = value;
	return result;
};

/** multiple Array.prototype.with */
const vectorMergePartial = <D extends number, T>(
	vector1: ReadonlyVector<D, T>,
	vector2: ReadonlyVector<D, T>,
	indexes: Iterable<number>,
): Vector<D, T> => {
	const result = vector1.slice() as unknown as Vector<D, T>;
	for (const index of indexes) {
		result[index] = vector2[index];
	}
	return result;
};

const createDfsBinarySearch = <
	D extends number,
	T,
	P extends (point: ReadonlyVector<D, T>) => boolean,
>(
	ctx: Context<D, T, P>,
) => {
	const { p, m, c, d } = ctx;

	const divide = function* (
		forward: ReadonlyVector<D, T>,
		backward: ReadonlyVector<D, T>,
		/**
		 * - midpoint when done = 0
		 * - midpoint with backward components 0 <= i < done when done > 0
		 */
		base: ReadonlyVector<D, T>,
		baseResult: boolean,
		done = 0,
		omit = new Set<number>(),
	): Generator<Division<D, T>> {
		if (omit.size === 0) {
			const division = baseResult
				? { always: base, never: forward }
				: { always: forward, never: base };
			yield division;
		}
		if (omit.size === d.length) return;
		for (let i = done; i < d.length; i++) {
			// Skip inactive components and already checked components
			if (!d[i]) continue;
			// omit transition i
			omit.add(i);

			// check if result changes between "base" and "forward without transition i"
			const newForward = vectorMergePartial(forward, base, omit);
			const newBackward = vectorMergePartial(base, backward, omit);
			const newResult = p(newForward);

			// All combinations without transition i won't include boundary
			if (newResult === baseResult) {
				omit.delete(i);
				continue;
			}

			const always = baseResult ? newBackward : newForward;
			const never = baseResult ? newForward : newBackward;

			// This division includes boundary
			yield { always, never };

			// Generate all combinations without transition i, which can include boundary
			yield* divide(forward, backward, base, baseResult, i + 1, omit);

			// All combinations without transition i are already generated, continue with transition i
			omit.delete(i);
		}
	};

	const dfsBinarySearch = function* (
		division: Division<D, T>,
	): Generator<Vector<D, T>> {
		const mid = m(division.always, division.never);
		const result = p(mid);
		const forward = result ? division.never : division.always;
		const backward = result ? division.always : division.never;

		for (const { always, never } of divide(forward, backward, mid, result)) {
			const _d = [...d];
			if (c(always, never)) {
				// Create a copy of the active dimensions to restore later
				// More division needed
				yield* dfsBinarySearch({ always, never });
				// Restore active dimensions deactivated by DFS
			} else {
				yield always;
			}
			d.splice(0, d.length, ..._d);
		}
	};
	return dfsBinarySearch;
};

export const ndBinarySearch = function* <D extends number, T>(
	alwaysEnd: ReadonlyVector<D, T>,
	neverEnd: ReadonlyVector<D, T>,
	predicate: (vector: ReadonlyVector<D, T>) => boolean,
	midpoint: FixedLengthArray<(always: T, never: T) => T, D>,
	shouldContinue: FixedLengthArray<(always: T, never: T) => boolean, D>,
) {
	const ctx = createContext(predicate, midpoint, shouldContinue);
	const dfsBinarySearch = createDfsBinarySearch(ctx);
	yield* dfsBinarySearch({ always: alwaysEnd, never: neverEnd });
};
