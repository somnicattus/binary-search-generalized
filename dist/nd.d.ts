import type { FixedLengthArray } from "type-fest";
export type Vector<D extends number, T> = FixedLengthArray<T, D>;
export type ReadonlyVector<D extends number, T> = Readonly<Vector<D, T>>;
export type Predicate<D extends number, T> = (vector: ReadonlyVector<D, T>) => boolean;
export type Midpoint<D extends number, T> = FixedLengthArray<(always: T, never: T) => T, D>;
export type ShouldContinue<D extends number, T> = FixedLengthArray<(always: T, never: T) => boolean, D>;
export declare const ndBinarySearch: <D extends number, T>(alwaysEnd: ReadonlyVector<D, T>, neverEnd: ReadonlyVector<D, T>, predicate: Predicate<D, T>, midpoint: Midpoint<D, T>, shouldContinue: ShouldContinue<D, T>) => Generator<Vector<D, T>, void, any>;
