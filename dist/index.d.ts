/**
 * Performs a generalized binary search on a specified range of primitive numeric (`number` and `bigint`) values.
 * @example
 * const result = binarySearch(
 *   0,
 *   100,
 *   (value) => value ** 2 <= 180,
 *   (low, high) => Math.floor((low + high) / 4) * 2, // This always returns an even number as the midpoint
 *   2, // The minimum difference between two distinct even numbers is 2
 * );
 * // result is 12 (the largest even number whose square is less than or equal to 180; floor_to_even(sqrt(180)))
 * // Note: midpoint must shrink the interval (move a bound each iteration) to guarantee termination.
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param midpoint - A function that determines the midpoint between two values.
 * @param epsilon - The maximum acceptable error margin for the search.
 * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 * @remarks Consider using {@link binarySearchInteger}, {@link binarySearchDouble}, or {@link binarySearchBigint} for specific numeric types, and {@link binarySearchArray} for arrays.
 * @see {@link binarySearchGeneralized} for non‑primitive numeric‑like values.
 * @function
 */
export declare const binarySearch: {
    /**
     * Performs a generalized binary search on a specified range of primitive numeric values.
     * @example
     * const result = binarySearch(
     *   0,
     *   100,
     *   (value) => value ** 2 <= 180,
     *   (low, high) => Math.floor((low + high) / 4) * 2, // This always returns an even number as the midpoint
     *   2, // The minimum difference between two distinct even numbers is 2
     * );
     * // result is 12 (the largest even number whose square is less than or equal to 180; floor_to_even(sqrt(180)))
     * // Note: choose a midpoint that strictly reduces the interval to avoid non-termination.
     * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
     * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
     * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
     * @param midpoint - A function that determines the midpoint between two values.
     * @param epsilon - The maximum acceptable error margin for the search.
     * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
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
    check: (value: number) => boolean, 
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
    epsilon: number, safety?: "check" | "nocheck"): number;
    /**
     * Performs a generalized binary search on a specified range of primitive numeric values.
     * @example
     * const result = binarySearch(
     *   0n,
     *   100n,
     *   (value) => value ** 2n <= 180n,
     *   (low, high) => (low + high) / 4n * 2n, // This always returns an even number as the midpoint
     *   2n, // The minimum difference between two distinct even numbers is 2
     * );
     * // result is 12n (the largest even number whose square is less than or equal to 180; floor_to_even(sqrt(180)))
     * // Note: midpoint must move a bound every iteration for termination.
     * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
     * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
     * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
     * @param midpoint - A function that determines the midpoint between two values.
     * @param epsilon - The maximum acceptable error margin for the search.
     * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
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
    check: (value: bigint) => boolean, 
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
    epsilon: bigint, safety?: "check" | "nocheck"): bigint;
};
/**
 * Performs a binary search on a specified range of integer values.
 * @example
 * const result = binarySearchInteger(
 *   0,
 *   100,
 *   (value) => value ** 2 <= 180,
 * );
 * // result is 13 (the largest integer whose square is less than or equal to 180; floor(sqrt(180)))
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 * @remarks In check mode, `alwaysEnd` and `neverEnd` must be safe integers (Number.isSafeInteger).
 */
export declare const binarySearchInteger: (alwaysEnd: number, neverEnd: number, 
/**
 * A function that checks if a value satisfies the condition.
 * @param value - The value to check.
 * @returns `true` if the value satisfies the condition, `false` otherwise.
 * @remarks This function should be monotonic within the range.
 */
check: (value: number) => boolean, safety?: "check" | "nocheck") => number;
/**
 * Performs a binary search on a specified range of bigint values.
 * @example
 * const result = binarySearchBigint(
 *   100n,
 *   0n,
 *   (value) => 2n ** value >= 10n ** 21n
 * );
 * // result is 70n (the smallest integer x such that 2^x is greater than or equal to 10^21; ceil(log2(1e21)))
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
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
check: (value: bigint) => boolean, safety?: "check" | "nocheck") => bigint;
/**
 * Performs a binary search on a specified range of double-precision floating-point values.
 * @example
 * const result = binarySearchDouble(
 *   0,
 *   Math.PI / 2,
 *   (value) => Math.sin(value) <= 0.5,
 *   0.0005,
 * );
 * // result will be in range π/6 - 0.0005 <= result < π/6 (close to the largest angle whose sine is less than or equal to 0.5; arcsin(0.5))
 * // Note: epsilon must be > 0 and representable at the magnitude of the endpoints.
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param epsilon - The maximum acceptable error margin for the search.
 * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
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
check: (value: number) => boolean, epsilon: number, safety?: "check" | "nocheck") => number;
/**
 * Performs a binary search on a sorted array.
 * @example
 * const index = binarySearchArray(['apple', 'banana', 'cherry', 'date', 'elderberry'], 'cherry');
 * // index will be 2
 * @example
 * const index = binarySearchArray([-90, -45, 0, 45, 90], 30);
 * // index will be -1 (not found)
 * @example
 * // Descending arrays are detected automatically (length >= 2)
 * const index = binarySearchArray([9, 7, 7, 5, 3], 7);
 * // index will be 1 (first occurrence)
 * @example
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
 * @function
 */
export declare const binarySearchArray: {
    /**
     * Performs a binary search on a sorted array.
     * @example
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
 * Performs a binary search on a sorted array. Returns the largest index if there are duplicates.
 * @example
 * const index = binarySearchArrayLast(['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry'], 'cherry');
 * // index will be 3
 * @param sortedArray - The sorted array to search. It can be an array of `number`, `bigint`, `string`, or any type that can be compared using `compareFn`.
 * @param target - The target value to find.
 * @param compareFn - A function that compares two values, which was used to sort the array. Returns a negative number if the first value is less than the second, a positive number if it's greater, and zero if they are equal.
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
 * Performs a binary search on a sorted array and returns the insertion point.
 * @example
 * const array = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
 * const insertion = 'cherry';
 * const index = binarySearchArrayInsertionLeft(array, insertion);
 * // index will be 2
 * array.splice(index, 0, insertion); // in-place insertion
 * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
 * // array and insertedArray will be ['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry']
 * @example
 * // Single-element arrays require explicit order when no comparator is provided
 * const i1 = binarySearchArrayInsertionLeft([5], 4, 'asc'); // 0
 * const i2 = binarySearchArrayInsertionLeft([5], 6, 'asc'); // 1
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
export declare const binarySearchArrayInsertionLeft: {
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
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
 * Performs a binary search on a sorted array and returns the insertion point.
 * @example
 * const array = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
 * const insertion = 'cherry';
 * const index = binarySearchArrayInsertionRight(array, insertion);
 * // index will be 3
 * array.splice(index, 0, insertion); // in-place insertion
 * const insertedArray = [...array.slice(0, index), insertion, ...array.slice(index)]; // new array with insertion
 * // array and insertedArray will be ['apple', 'banana', 'cherry', 'cherry', 'date', 'elderberry']
 * @example
 * // Single-element arrays require explicit order when no comparator is provided
 * const j1 = binarySearchArrayInsertionRight([5], 5, 'asc'); // 1
 * const j2 = binarySearchArrayInsertionRight([5], 4, 'asc'); // 0
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
export declare const binarySearchArrayInsertionRight: {
    /**
     * Performs a binary search on a sorted array and returns the insertion point.
     * @example
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
 * Performs a generalized binary search on a specified range of non‑primitive numeric‑like values.
 * @example
 * const target = new Date('1970-01-01T03:00:00Z').getTime();
 * const result = binarySearchGeneralized(
 *   new Date('1970-01-01T00:00:00Z'),
 *   new Date('1970-01-02T00:00:00Z'),
 *   (value) => value.getTime() <= target,
 *   // Round midpoint to minute resolution so it pairs with the termination rule below
 *   (always, never) => {
 *     const mid = new Date((always.getTime() + never.getTime()) / 2);
 *     mid.setUTCSeconds(0, 0);
 *     return mid;
 *   },
 *   // Continue while the gap is greater than one minute; ensures convergence with the rounding above
 *   (always, never) => never.getTime() - always.getTime() > 60_000,
 * );
 * // result will be a Date object representing '1970-01-01T03:00:00Z'
 * @param alwaysEnd - The value that always satisfies the condition and is one end of the range.
 * @param neverEnd - The value that never satisfies the condition and is the other end of the range.
 * @param check - A function that checks if a value satisfies the condition. This function should be monotonic within the range.
 * @param midpoint - A function that determines the midpoint between two values.
 * @param shouldContinue - A function that determines whether to continue the search based on the difference between `never` and `always`.
 * @param safety - A string literal that determines whether to perform parameter checks. Use `"nocheck"` to skip parameter checks.
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
check: (value: T) => boolean, 
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
shouldContinue: (always: T, never: T) => boolean, safety?: "check" | "nocheck") => T;
