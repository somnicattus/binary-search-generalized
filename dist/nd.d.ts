type Vector = readonly unknown[];
export type Predicate<T extends Vector> = (vector: T) => boolean;
type _Midpoint<T extends Vector, U extends Vector = T, A extends unknown[] = []> = number extends T["length"] ? readonly ((always: T[number], never: T[number]) => T[number])[] : U extends readonly [infer F, ...infer R extends unknown[]] ? _Midpoint<T, R, [...A, (always: F, never: F) => F]> : A;
export type Midpoint<T extends Vector> = _Midpoint<T>;
type _ShouldContinue<T extends Vector, U extends Vector = T, A extends unknown[] = []> = number extends T["length"] ? readonly ((always: T[number], never: T[number]) => boolean)[] : U extends readonly [infer F, ...infer R extends unknown[]] ? _ShouldContinue<T, R, [...A, (always: F, never: F) => boolean]> : A;
export type ShouldContinue<T extends Vector> = _ShouldContinue<T>;
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
 * @typeParam T - A tuple/array type representing a vector in N dimensions.
 * @param alwaysEnd A vector that definitely satisfies the predicate (inside/true corner).
 * @param neverEnd A vector that definitely does not satisfy the predicate (outside/false corner).
 * @param predicate Monotone decision function across the hyper-rectangle from `alwaysEnd` to `neverEnd`.
 * @param midpoint Per-dimension midpoint functions; only applied to still-active dimensions.
 * @param shouldContinue Per-dimension continuation predicates; a dimension deactivates when this returns false.
 * @returns A generator yielding vectors on the inside border; output order is not guaranteed.
 */
export declare const ndBinarySearch: <T extends Vector>(alwaysEnd: T, neverEnd: T, predicate: Predicate<T>, midpoint: Midpoint<T>, shouldContinue: ShouldContinue<T>) => Generator<T>;
export {};
