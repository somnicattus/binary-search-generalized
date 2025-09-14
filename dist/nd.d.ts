type Vector = readonly unknown[];
export type Predicate<T extends Vector> = (vector: T) => boolean;
type _Midpoint<T extends Vector, U extends Vector = T, A extends unknown[] = []> = number extends T["length"] ? readonly ((always: T[number], never: T[number]) => T[number])[] : U extends readonly [infer F, ...infer R extends unknown[]] ? _Midpoint<T, R, [...A, (always: F, never: F) => F]> : A;
export type Midpoint<T extends Vector> = _Midpoint<T>;
type _ShouldContinue<T extends Vector, U extends Vector = T, A extends unknown[] = []> = number extends T["length"] ? readonly ((always: T[number], never: T[number]) => boolean)[] : U extends readonly [infer F, ...infer R extends unknown[]] ? _ShouldContinue<T, R, [...A, (always: F, never: F) => boolean]> : A;
export type ShouldContinue<T extends Vector> = _ShouldContinue<T>;
export declare const ndBinarySearch: <T extends Vector>(alwaysEnd: T, neverEnd: T, predicate: Predicate<T>, midpoint: Midpoint<T>, shouldContinue: ShouldContinue<T>) => Generator<T>;
export {};
