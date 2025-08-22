/**
 * Performs a generalized binary search over a range of primitive numeric values (`number` or `bigint`).
 * @example
 * import { binarySearch } from "binary-search-generalized";
 * const result = binarySearch(
 *   0,
 *   100,
 *   (value) => value ** 2 <= 180,
 *   (low, high) => Math.floor(low / 4 + high / 4) * 2, // Always returns an even number
 *   2, // The minimum difference between two distinct even numbers is 2
 * );
 * // result is 12 (the largest even number whose square is less than or equal to 180; floor_to_even(sqrt(180)))
 * // Note: midpoint must shrink the interval (move a bound each iteration) to guarantee termination.
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param midpoint - A function that determines the midpoint between two values.
 * @param epsilon - The maximum acceptable error margin for the search.
 * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks. Use `"strict"` to verify midpoint convergence on every call.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 * @remarks Consider using {@link binarySearchInteger}, {@link binarySearchDouble}, or {@link binarySearchBigint} for specific numeric types, and {@link binarySearchArray} for arrays.
 * @see {@link binarySearchGeneralized} for non‑primitive numeric‑like values.
 * @function
 */
export declare const binarySearch: {
    /**
     * Performs a generalized binary search over a range of primitive numeric values.
     * @example
     * import { binarySearch } from "binary-search-generalized";
     * const result = binarySearch(
     *   0,
     *   100,
     *   (value) => value ** 2 <= 180,
     *   (low, high) => Math.floor(low / 4 + high / 4) * 2, // Always returns an even number
     *   2, // The minimum difference between two distinct even numbers is 2
     * );
     * // result is 12 (the largest even number whose square is less than or equal to 180; floor_to_even(sqrt(180)))
     * // Note: choose a midpoint that strictly reduces the interval to avoid non‑termination.
     * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
     * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
     * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
     * @param midpoint - A function that determines the midpoint between two values.
     * @param epsilon - The maximum acceptable error margin for the search.
     * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks. Use `"strict"` to verify midpoint convergence on every call.
     * @returns The boundary value that satisfies the condition.
     * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
     * @see {@link binarySearchGeneralized} for non‑primitive numeric‑like values.
     */
    (alwaysEnd: number, neverEnd: number, 
    /**
     * A function that checks if a value satisfies the condition.
     * @param value - The value to check.
     * @returns `true` if the value satisfies the condition, `false` otherwise.
     * @remarks This function should be monotonic within the range.
     */
    predicate: (value: number) => boolean, 
    /**
     * A function that determines the midpoint between two values.
     * @param low - The lower bound of the range.
     * @param high - The upper bound of the range.
     * @returns The midpoint between `low` and `high`.
     */
    midpoint: (low: number, high: number) => number, 
    /**
     * The maximum acceptable error margin for the search.
     */
    epsilon: number, 
    /** @default "check" */
    safety?: "check" | "nocheck" | "strict"): number;
    /**
     * Performs a generalized binary search over a range of primitive numeric values.
     * @example
     * import { binarySearch } from "binary-search-generalized";
     * const result = binarySearch(
     *   0n,
     *   100n,
     *   (value) => value ** 2n <= 180n,
     *   (low, high) => ((low + high) / 4n) * 2n, // Always returns an even number as the midpoint
     *   2n, // The minimum difference between two distinct even numbers is 2
     * );
     * // result is 12n (the largest even number whose square is less than or equal to 180; floor_to_even(sqrt(180)))
     * // Note: midpoint must move a bound every iteration for termination.
     * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
     * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
     * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
     * @param midpoint - A function that determines the midpoint between two values.
     * @param epsilon - The maximum acceptable error margin for the search.
     * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks. Use `"strict"` to verify midpoint convergence on every call.
     * @returns The boundary value that satisfies the condition.
     * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
     * @see {@link binarySearchGeneralized} for non‑primitive numeric‑like values.
     */
    (alwaysEnd: bigint, neverEnd: bigint, 
    /**
     * A function that checks if a value satisfies the condition.
     * @param value - The value to check.
     * @returns `true` if the value satisfies the condition, `false` otherwise.
     * @remarks This function should be monotonic within the range.
     */
    predicate: (value: bigint) => boolean, 
    /**
     * A function that determines the midpoint between two values.
     * @param low - The lower bound of the range.
     * @param high - The upper bound of the range.
     * @returns The midpoint between `low` and `high`.
     */
    midpoint: (low: bigint, high: bigint) => bigint, 
    /**
     * The maximum acceptable error margin for the search.
     */
    epsilon: bigint, 
    /** @default "check" */
    safety?: "check" | "nocheck" | "strict"): bigint;
};
/**
 * Performs a binary search over a range of integer values.
 * @example
 * import { binarySearchInteger } from "binary-search-generalized";
 * const result = binarySearchInteger(
 *   0,
 *   100,
 *   (value) => value ** 2 <= 180,
 * );
 * // result is 13 (the largest integer whose square is less than or equal to 180; floor(sqrt(180)))
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 * @remarks In check mode, `alwaysEnd` and `neverEnd` must be safe integers (`Number.isSafeInteger`).
 */
export declare const binarySearchInteger: (alwaysEnd: number, neverEnd: number, 
/**
 * A function that checks if a value satisfies the condition.
 * @param value - The value to check.
 * @returns `true` if the value satisfies the condition, `false` otherwise.
 * @remarks This function should be monotonic within the range.
 */
predicate: (value: number) => boolean, 
/** @default "check" */
safety?: "check" | "nocheck") => number;
/**
 * Performs a binary search over a range of bigint values.
 * @example
 * import { binarySearchBigint } from "binary-search-generalized";
 * const result = binarySearchBigint(
 *   100n,
 *   0n,
 *   (value) => 2n ** value >= 10n ** 21n
 * );
 * // result is 70n (the smallest integer x such that 2^x is greater than or equal to 10^21; ceil(log2(1e21)))
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 */
export declare const binarySearchBigint: (alwaysEnd: bigint, neverEnd: bigint, 
/**
 * A function that checks if a value satisfies the condition.
 * @param value - The value to check.
 * @returns `true` if the value satisfies the condition, `false` otherwise.
 * @remarks This function should be monotonic within the range.
 */
predicate: (value: bigint) => boolean, 
/** @default "check" */
safety?: "check" | "nocheck") => bigint;
/**
 * Performs a binary search over a range of double‑precision floating‑point values.
 * @example
 * import { binarySearchDouble } from "binary-search-generalized";
 * const result = binarySearchDouble(
 *   0,
 *   Math.PI / 2,
 *   (value) => Math.sin(value) <= 0.5,
 *   0.0005,
 * );
 * // result will be in the range [π/6 - 0.0005, π/6] (close to the largest angle whose sine is less than or equal to 0.5; arcsin(0.5))
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param epsilon - The maximum acceptable error margin for the search. By default (`"auto"`), it is calculated by {@link getEpsilon}. `"limit"` performs repeated refinements until reaching the representational limit.
 * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 */
export declare const binarySearchDouble: (alwaysEnd: number, neverEnd: number, 
/**
 * A function that checks if a value satisfies the condition.
 * @param value - The value to check.
 * @returns `true` if the value satisfies the condition, `false` otherwise.
 * @remarks This function should be monotonic within the range.
 */
predicate: (value: number) => boolean, 
/**
 * The maximum acceptable error margin for the search.
 * - a positive number: absolute termination gap; must be representable at the scale of the endpoints.
 * - "auto" (default): picks a safe epsilon: `floor_to_base_2(max(|alwaysEnd|, |neverEnd|)) * 2^-52` for normal values, `2^-1074` for subnormal values.
 * - `"limit"`: starts like `"auto"`, then continues refining until reaching the representational limit of double‑precision values.
 * @default "auto"
 */
epsilon?: number | "auto" | "limit", 
/** @default "check" */
safety?: "check" | "nocheck") => number;
/**
 * Performs a binary search on a sorted array.
 * @example
 * import { binarySearchArray } from "binary-search-generalized";
 * const index = binarySearchArray(['apple', 'banana', 'cherry', 'date', 'elderberry'], 'cherry');
 * // index will be 2
 * @example
 * import { binarySearchArray } from "binary-search-generalized";
 * const index = binarySearchArray([-90, -45, 0, 45, 90], 30);
 * // index will be -1 (not found)
 * @example
 * // Descending arrays are detected automatically (length >= 2)
 * import { binarySearchArray } from "binary-search-generalized";
 * const index = binarySearchArray([9, 7, 7, 5, 3], 7);
 * // index will be 1 (first occurrence)
 * @example
 * import { binarySearchArray } from "binary-search-generalized";
 * const index = binarySearchArray(
 *   [{ id: 1 }, { id: 2 }, { id: 3 }],
 *   { id: 2 },
 *   (a, b) => a.id - b.id,
 * );
 * // index will be 1
 * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
 * @param target - The target value to find.
 * @param compareFn - Comparator used to sort the array. Returns a negative number if the first value is less than the second, a positive number if greater, and zero if equal.
 * @template T - The type of the elements in the sorted array.
 * @returns The index of the target value, or -1 if not found.
 * @remarks Returns the smallest index if there are duplicates. If you want the largest index, use {@link binarySearchArrayLast}.
 * @see {@link binarySearchArrayInsertionLeft} for finding the insertion point.
 * @function
 */
export declare const binarySearchArray: {
    /**
     * Performs a binary search on a sorted array.
     * @example
     * import { binarySearchArray } from "binary-search-generalized";
     * const index = binarySearchArray([-90, -45, 0, 45, 90], 30);
     * // index will be -1 (not found)
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks Returns the smallest index if there are duplicates. If you want the largest index, use {@link binarySearchArrayLast}.
     * @see {@link binarySearchArrayInsertionLeft} for finding the insertion point.
     */
    (sortedArray: ArrayLike<number>, target: number): number;
    /**
     * Performs a binary search on a sorted array.
     * @example
     * import { binarySearchArray } from "binary-search-generalized";
     * const index = binarySearchArray([-90n, -45n, 0n, 45n, 90n], 30n);
     * // index will be -1 (not found)
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks Returns the smallest index if there are duplicates. If you want the largest index, use {@link binarySearchArrayLast}.
     * @see {@link binarySearchArrayInsertionLeft} for finding the insertion point.
     */
    (sortedArray: ArrayLike<bigint>, target: bigint): number;
    /**
     * Performs a binary search on a sorted array.
     * @example
     * import { binarySearchArray } from "binary-search-generalized";
     * const index = binarySearchArray(['apple', 'banana', 'cherry', 'date', 'elderberry'], 'cherry');
     * // index will be 2
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks Returns the smallest index if there are duplicates. If you want the largest index, use {@link binarySearchArrayLast}.
     * @see {@link binarySearchArrayInsertionLeft} for finding the insertion point.
     */
    (sortedArray: ArrayLike<string>, target: string): number;
    /**
     * Performs a binary search on a sorted array.
     * @example
     * import { binarySearchArray } from "binary-search-generalized";
     * const index = binarySearchArray(
     *   [{ id: 1 }, { id: 2 }, { id: 3 }],
     *   { id: 2 },
     *   (a, b) => a.id - b.id,
     * );
     * // index will be 1
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param compareFn - A function that compares two values, which was used to sort the array. Returns a negative number if the first value is less than the second, a positive number if it's greater, and zero if they are equal.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks Returns the smallest index if there are duplicates. If you want the largest index, use {@link binarySearchArrayLast}.
     * @see {@link binarySearchArrayInsertionLeft} for finding the insertion point.
     */
    <T>(sortedArray: ArrayLike<T>, target: T, 
    /**
     * A function that compares two values, which was used to sort the array.
     * @param a - The first value.
     * @param b - The second value.
     * @returns A negative number if `a` comes before `b`, a positive number if `a` comes after `b`, and zero if they are equal.
     */
    compareFn: (a: T, b: T) => number): number;
};
/**
 * Alias of {@link binarySearchArray}
 */
export declare const bsFindIndex: {
    (sortedArray: ArrayLike<number>, target: number): number;
    (sortedArray: ArrayLike<bigint>, target: bigint): number;
    (sortedArray: ArrayLike<string>, target: string): number;
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Performs a binary search on a sorted array. Returns the largest index when duplicates exist.
 * @example
 * import { binarySearchArrayLast } from "binary-search-generalized";
 * const index = binarySearchArrayLast(['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry'], 'cherry');
 * // index will be 3
 * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
 * @param target - The target value to find.
 * @param compareFn - Comparator used to sort the array. Returns a negative number if the first value is less than the second, a positive number if greater, and zero if equal.
 * @template T - The type of the elements in the sorted array.
 * @returns The index of the target value, or -1 if not found.
 * @remarks If you want the smallest index, use {@link binarySearchArray}.
 * @see {@link binarySearchArrayInsertionRight} for finding the insertion point.
 * @function
 */
export declare const binarySearchArrayLast: {
    /**
     * Performs a binary search on a sorted array. Returns the largest index if there are duplicates.
     * @example
     * import { binarySearchArrayLast } from "binary-search-generalized";
     * const index = binarySearchArrayLast([-90, -45, 0, 45, 90], 30);
     * // index will be -1 (not found)
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks If you want the smallest index, use {@link binarySearchArray}.
     * @see {@link binarySearchArrayInsertionRight} for finding the insertion point.
     */
    <T extends number>(sortedArray: ArrayLike<T>, target: T): number;
    /**
     * Performs a binary search on a sorted array. Returns the largest index if there are duplicates.
     * @example
     * import { binarySearchArrayLast } from "binary-search-generalized";
     * const index = binarySearchArrayLast([-90n, -45n, 0n, 45n, 90n], 30n);
     * // index will be -1 (not found)
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks If you want the smallest index, use {@link binarySearchArray}.
     * @see {@link binarySearchArrayInsertionRight} for finding the insertion point.
     */
    <T extends bigint>(sortedArray: ArrayLike<T>, target: T): number;
    /**
     * Performs a binary search on a sorted array. Returns the largest index if there are duplicates.
     * @example
     * import { binarySearchArrayLast } from "binary-search-generalized";
     * const index = binarySearchArrayLast(['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry'], 'cherry');
     * // index will be 3
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks If you want the smallest index, use {@link binarySearchArray}.
     * @see {@link binarySearchArrayInsertionRight} for finding the insertion point.
     */
    <T extends string>(sortedArray: ArrayLike<T>, target: T): number;
    /**
     * Performs a binary search on a sorted array. Returns the largest index if there are duplicates.
     * @example
     * import { binarySearchArrayLast } from "binary-search-generalized";
     * const index = binarySearchArrayLast([{ id: 1 }, { id: 2 }, { id: 3 }], { id: 2 }, (a, b) => a.id - b.id);
     * // index will be 1
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param compareFn - A function that compares two values, which was used to sort the array. Returns a negative number if the first value is less than the second, a positive number if it's greater, and zero if they are equal.
     * @template T - The type of the elements in the sorted array.
     * @returns The index of the target value, or -1 if not found.
     * @remarks If you want the smallest index, use {@link binarySearchArray}.
     * @see {@link binarySearchArrayInsertionRight} for finding the insertion point.
     */
    <T>(sortedArray: ArrayLike<T>, target: T, 
    /**
     * A function that compares two values, which was used to sort the array.
     * @param a - The first value.
     * @param b - The second value.
     * @returns A negative number if `a` should be ordered before `b`, a positive number if it should be ordered after, and zero if they are equal.
     */
    compareFn: (a: T, b: T) => number): number;
};
/**
 * Alias of {@link binarySearchArrayLast}
 */
export declare const bsFindLastIndex: {
    <T extends number>(sortedArray: ArrayLike<T>, target: T): number;
    <T extends bigint>(sortedArray: ArrayLike<T>, target: T): number;
    <T extends string>(sortedArray: ArrayLike<T>, target: T): number;
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Performs a binary search on a sorted array and returns the left insertion point.
 * @example
 * import { binarySearchArrayInsertionLeft } from "binary-search-generalized";
 * const array = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
 * const insertion = 'cherry';
 * const index = binarySearchArrayInsertionLeft(array, insertion);
 * // index will be 2
 * array.splice(index, 0, insertion); // in-place insertion
 * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
 * // array and insertedArray will be ['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry']
 * @example
 * // Single-element arrays require explicit order when no comparator is provided
 * import { binarySearchArrayInsertionLeft } from "binary-search-generalized";
 * const i1 = binarySearchArrayInsertionLeft([5], 4, 'asc'); // 0
 * const i2 = binarySearchArrayInsertionLeft([5], 6, 'asc'); // 1
 * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
 * @param target - The target value to find.
 * @param order - The order of the sorted array. If omitted, the function infers the order from the first and the last elements. Required when the array may contain only one element.
 * @param compareFn - Comparator used to sort the array. Returns a negative number if the first value is less than the second, a positive number if greater, and zero if equal.
 * @template T - The type of the elements in the sorted array.
 * @returns The index at which the target value should be inserted.
 * @throws {RangeError} If `sortedArray` has a single element and `order` is not specified.
 * @remarks If `sortedArray` already contains the target value, the insertion point will be before the first occurrence.
 * @see {@link binarySearchArrayInsertionRight} for the right insertion point.
 * @see {@link binarySearchArray} for finding the exact index of the target.
 * @function
 */
export declare const binarySearchArrayInsertionLeft: {
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionLeft } from "binary-search-generalized";
     * const array = [-90, -45, 0, 45, 90];
     * const insertion = 0;
     * const index = binarySearchArrayInsertionLeft(array, insertion);
     * // index will be 2
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be [-90, -45, 0, 0, 45, 90]
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be before the first occurrence.
     * @see {@link binarySearchArrayInsertionRight} for the right insertion point.
     * @see {@link binarySearchArray} for finding the exact index of the target.
     * @function
     */
    (sortedArray: ArrayLike<number>, target: number, order?: "asc" | "desc"): number;
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionLeft } from "binary-search-generalized";
     * const array = [-90n, -45n, 0n, 45n, 90n];
     * const insertion = 0n;
     * const index = binarySearchArrayInsertionLeft(array, insertion);
     * // index will be 2
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be [-90n, -45n, 0n, 0n, 45n, 90n]
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be before the first occurrence.
     * @see {@link binarySearchArrayInsertionRight} for the right insertion point.
     * @see {@link binarySearchArray} for finding the exact index of the target.
     * @function
     */
    (sortedArray: ArrayLike<bigint>, target: bigint, order?: "asc" | "desc"): number;
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionLeft } from "binary-search-generalized";
     * const array = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
     * const insertion = 'cherry';
     * const index = binarySearchArrayInsertionLeft(array, insertion);
     * // index will be 2
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be ['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry']
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be before the first occurrence.
     * @see {@link binarySearchArrayInsertionRight} for the right insertion point.
     * @see {@link binarySearchArray} for finding the exact index of the target.
     * @function
     */
    (sortedArray: ArrayLike<string>, target: string, order?: "asc" | "desc"): number;
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionLeft } from "binary-search-generalized";
     * const array = [{ id: 1 }, { id: 2 }, { id: 4 }];
     * const insertion = { id: 3 };
     * const index = binarySearchArrayInsertionLeft(array, insertion);
     * // index will be 2
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @param compareFn - A function that compares two values, which was used to sort the array. Returns a negative number if the first value is less than the second, a positive number if it's greater, and zero if they are equal.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be before the first occurrence.
     * @see {@link binarySearchArrayInsertionRight} for the right insertion point.
     * @see {@link binarySearchArray} for finding the exact index of the target.
     * @function
     */
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Alias of {@link binarySearchArrayInsertionLeft}
 */
export declare const bsInsertionLeft: {
    (sortedArray: ArrayLike<number>, target: number, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<bigint>, target: bigint, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<string>, target: string, order?: "asc" | "desc"): number;
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Alias of {@link binarySearchArrayInsertionLeft}
 */
export declare const bsLowerBound: {
    (sortedArray: ArrayLike<number>, target: number, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<bigint>, target: bigint, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<string>, target: string, order?: "asc" | "desc"): number;
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Performs a binary search on a sorted array and returns the right insertion point.
 * @example
 * import { binarySearchArrayInsertionRight } from "binary-search-generalized";
 * const array = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
 * const insertion = 'cherry';
 * const index = binarySearchArrayInsertionRight(array, insertion);
 * // index will be 3
 * array.splice(index, 0, insertion); // in-place insertion
 * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
 * // array and insertedArray will be ['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry']
 * @example
 * // Single-element arrays require explicit order when no comparator is provided
 * import { binarySearchArrayInsertionRight } from "binary-search-generalized";
 * const j1 = binarySearchArrayInsertionRight([5], 5, 'asc'); // 1
 * const j2 = binarySearchArrayInsertionRight([5], 4, 'asc'); // 0
 * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
 * @param target - The target value to find.
 * @param order - The order of the sorted array. If omitted, the function infers the order from the first two elements. Required if the array may contain only one element.
 * @param compareFn - Comparator used to sort the array. Returns a negative number if the first value is less than the second, a positive number if greater, and zero if equal.
 * @template T - The type of the elements in the sorted array.
 * @returns The index at which the target value should be inserted.
 * @throws {RangeError} If `sortedArray` has a single element and `order` is not specified.
 * @remarks If `sortedArray` already contains the target value, the insertion point will be after the last occurrence.
 * @see {@link binarySearchArrayInsertionLeft} for the left insertion point.
 * @see {@link binarySearchArrayLast} for finding the exact index of the target.
 * @function
 */
export declare const binarySearchArrayInsertionRight: {
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionRight } from "binary-search-generalized";
     * const array = [-90, -45, 0, 45, 90];
     * const insertion = 0;
     * const index = binarySearchArrayInsertionRight(array, insertion);
     * // index will be 3
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be [-90, -45, 0, 0, 45, 90]
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be after the last occurrence.
     * @see {@link binarySearchArrayInsertionLeft} for the left insertion point.
     * @see {@link binarySearchArrayLast} for finding the exact index of the target.
     * @function
     */
    (sortedArray: ArrayLike<number>, target: number, order?: "asc" | "desc"): number;
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionRight } from "binary-search-generalized";
     * const array = [-90n, -45n, 0n, 45n, 90n];
     * const insertion = 0n;
     * const index = binarySearchArrayInsertionRight(array, insertion);
     * // index will be 3
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be [-90n, -45n, 0n, 0n, 45n, 90n]
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be after the last occurrence.
     * @see {@link binarySearchArrayInsertionLeft} for the left insertion point.
     * @see {@link binarySearchArrayLast} for finding the exact index of the target.
     * @function
     */
    (sortedArray: ArrayLike<bigint>, target: bigint, order?: "asc" | "desc"): number;
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionRight } from "binary-search-generalized";
     * const array = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
     * const insertion = 'cherry';
     * const index = binarySearchArrayInsertionRight(array, insertion);
     * // index will be 3
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be ['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry']
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be after the last occurrence.
     * @see {@link binarySearchArrayInsertionLeft} for the left insertion point.
     * @see {@link binarySearchArrayLast} for finding the exact index of the target.
     * @function
     */
    (sortedArray: ArrayLike<string>, target: string, order?: "asc" | "desc"): number;
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
     * import { binarySearchArrayInsertionRight } from "binary-search-generalized";
     * const array = [{ id: 1 }, { id: 2 }, { id: 4 }];
     * const insertion = { id: 3 };
     * const index = binarySearchArrayInsertionRight(array, insertion);
     * // index will be 2
     * array.splice(index, 0, insertion); // in-place insertion
     * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
     * // array and insertedArray will be [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
     * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
     * @param target - The target value to find.
     * @param order - The order of the sorted array. If not specified, the function will determine the order based on the first two elements. Required if the array may contain only one element.
     * @param compareFn - A function that compares two values, which was used to sort the array. Returns a negative number if the first value is less than the second, a positive number if it's greater, and zero if they are equal.
     * @template T - The type of the elements in the sorted array.
     * @returns The index at which the target value should be inserted.
     * @throws {RangeError} If the sortedArray has only one element and order is not specified.
     * @remarks If the sortedArray already contains the target value, the insertion point will be after the last occurrence.
     * @see {@link binarySearchArrayInsertionLeft} for the left insertion point.
     * @see {@link binarySearchArrayLast} for finding the exact index of the target.
     * @function
     */
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Alias of {@link binarySearchArrayInsertionRight}
 */
export declare const bsInsertionRight: {
    (sortedArray: ArrayLike<number>, target: number, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<bigint>, target: bigint, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<string>, target: string, order?: "asc" | "desc"): number;
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Alias of {@link binarySearchArrayInsertionRight}
 */
export declare const bsUpperBound: {
    (sortedArray: ArrayLike<number>, target: number, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<bigint>, target: bigint, order?: "asc" | "desc"): number;
    (sortedArray: ArrayLike<string>, target: string, order?: "asc" | "desc"): number;
    <T>(sortedArray: ArrayLike<T>, target: T, compareFn: (a: T, b: T) => number): number;
};
/**
 * Performs a generalized binary search over a range of non‑primitive numeric‑like values.
 * @example
 * import BigNumber from "bignumber.js";
 * import { binarySearchGeneralized } from "binary-search-generalized";
 * const result = binarySearchGeneralized(
 *   new BigNumber('0'),
 *   new BigNumber('1000000000000000'), // 1e15
 *   (value) => value.isLessThan('100000000'), // monotonic predicate
 *   // Use an integer midpoint so it pairs with the termination rule below
 *   (always, never) =>
 *     always.plus(never).dividedBy(2).integerValue(BigNumber.ROUND_FLOOR),
 *   // Continue while the gap is greater than 1; ensures convergence with the rounding above
 *   (always, never) => never.minus(always).isGreaterThan(1),
 * );
 * // result will be BigNumber('99999999')
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param predicate - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param midpoint - A function that determines the midpoint between two values.
 * @param shouldContinue - Determines whether to continue searching based on the difference between `never` and `always`.
 * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 * @remarks Consider using {@link binarySearch} for primitive numeric (`number` and `bigint`) values.
 */
export declare const binarySearchGeneralized: <T>(alwaysEnd: T, neverEnd: T, 
/**
 * A function that checks if a value satisfies the condition.
 * @param value - The value to check.
 * @returns `true` if the value satisfies the condition, `false` otherwise.
 * @remarks This function should be monotonic within the range.
 */
predicate: (value: T) => boolean, 
/**
 * A function that determines the midpoint between two values.
 * @param always - The value that always satisfies the condition.
 * @param never - The value that never satisfies the condition.
 * @returns The midpoint between the two values.
 */
midpoint: (always: T, never: T) => T, 
/**
 * A function that determines whether to continue the search based on the difference between `never` and `always`.
 * @param always - The value that always satisfies the condition.
 * @param never - The value that never satisfies the condition.
 * @returns `true` if the search should continue, `false` otherwise.
 */
shouldContinue: (always: T, never: T) => boolean, 
/** @default "check" */
safety?: "check" | "nocheck") => T;
/**
 * Calculates a safe epsilon for a range of double‑precision floating‑point numbers.
 * @param value1 - The first number.
 * @param value2 - The second number.
 * @returns The epsilon value: `floor_to_base_2(max(|value1|, |value2|)) * 2^-52` for normal values, `2^-1074` for subnormal values.
 */
export declare const getEpsilon: (value1: number, value2: number) => number;
/**
 * Calculates the unit in the last place (ULP) for a given floating-point number.
 * @param value - The floating-point number.
 * @returns The ULP of the given number.
 */
export declare const getUlp: (value: number) => number;
