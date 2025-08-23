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
export const binarySearch: {
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
	(
		alwaysEnd: number,
		neverEnd: number,
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
		safety?: "check" | "nocheck" | "strict",
	): number;
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
	(
		alwaysEnd: bigint,
		neverEnd: bigint,
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
		safety?: "check" | "nocheck" | "strict",
	): bigint;
} = <T extends number | bigint>(
	alwaysEnd: T,
	neverEnd: T,
	predicate: (value: T) => boolean,
	midpoint: (low: T, high: T) => T,
	epsilon: T,
	safety: "check" | "nocheck" | "strict" = "check",
): T => {
	const alwaysIsLower = alwaysEnd < neverEnd;
	let low = alwaysIsLower ? alwaysEnd : neverEnd;
	let high = alwaysIsLower ? neverEnd : alwaysEnd;

	if (safety === "check" || safety === "strict") {
		if (
			typeof alwaysEnd !== typeof neverEnd ||
			typeof epsilon !== typeof alwaysEnd
		) {
			throw new RangeError(
				"alwaysEnd, neverEnd, and epsilon must be of the same type",
			);
		}
		if (!predicate(alwaysEnd)) {
			throw new RangeError("alwaysEnd must satisfy the condition");
		}
		if (predicate(neverEnd)) {
			throw new RangeError("neverEnd must not satisfy the condition");
		}
		if (epsilon <= 0) {
			throw new RangeError("epsilon must be positive");
		}
		if (high - low < epsilon) {
			throw new RangeError(
				"alwaysEnd and neverEnd must be different within the epsilon range",
			);
		}
		if (typeof epsilon === "number") {
			if (
				!Number.isFinite(epsilon) ||
				!Number.isFinite(alwaysEnd) ||
				!Number.isFinite(neverEnd)
			) {
				throw new RangeError(
					"alwaysEnd, neverEnd, and epsilon must be finite numbers",
				);
			}
			if (high - epsilon === high || (low as number) + epsilon === low) {
				throw new RangeError(
					"epsilon must be representable at the precision of alwaysEnd and neverEnd",
				);
			}
		}
	}

	if (safety === "strict") {
		while (high - low > epsilon) {
			const middle = midpoint(low, high);
			if (Number.isNaN(middle) || middle >= high || middle <= low) {
				throw new RangeError(
					`midpoint function did not converge: got ${middle} with ${low} and ${high}`,
				);
			}
			if (predicate(middle) === alwaysIsLower) low = middle;
			else high = middle;
		}

		return alwaysIsLower ? low : high;
	}

	while (high - low > epsilon) {
		const middle = midpoint(low, high);
		if (predicate(middle) === alwaysIsLower) low = middle;
		else high = middle;
	}

	return alwaysIsLower ? low : high;
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
export const binarySearchInteger = (
	alwaysEnd: number,
	neverEnd: number,
	/**
	 * A function that checks if a value satisfies the condition.
	 * @param value - The value to check.
	 * @returns `true` if the value satisfies the condition, `false` otherwise.
	 * @remarks This function should be monotonic within the range.
	 */
	predicate: (value: number) => boolean,
	/** @default "check" */
	safety: "check" | "nocheck" = "check",
) => {
	if (safety === "check") {
		if (
			Number.isSafeInteger(alwaysEnd) === false ||
			Number.isSafeInteger(neverEnd) === false
		) {
			throw new RangeError("alwaysEnd and neverEnd must be safe integers");
		}
	}

	return binarySearch(
		alwaysEnd,
		neverEnd,
		predicate,
		(low, high) => Math.floor(low / 2 + high / 2),
		1,
		safety,
	);
};

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
export const binarySearchBigint = (
	alwaysEnd: bigint,
	neverEnd: bigint,
	/**
	 * A function that checks if a value satisfies the condition.
	 * @param value - The value to check.
	 * @returns `true` if the value satisfies the condition, `false` otherwise.
	 * @remarks This function should be monotonic within the range.
	 */
	predicate: (value: bigint) => boolean,
	/** @default "check" */
	safety: "check" | "nocheck" = "check",
): bigint => {
	return binarySearch(
		alwaysEnd,
		neverEnd,
		predicate,
		(low, high) => (low + high) / 2n,
		1n,
		safety,
	);
};

/**
 * @private
 * A DataView for reading the binary representation of floating‑point numbers.
 */
const view = new DataView(new ArrayBuffer(8));
/**
 * @private
 * Returns the exponent of a double‑precision floating‑point number.
 *
 * Equivalent to `log2(floor_to_base_2(abs(value)))`. More precise than `floor(log2(abs(value)))`.
 *
 * Edge cases:
 *   - `-1023` for `±0` and subnormal values (value where `|value| < 2^-1022`)
 *   - `1024` for `±Infinity` and `NaN`
 * @param value - The number whose exponent is returned.
 * @returns The unbiased base‑2 exponent of the value.
 */
const getExponent = (value: number): number => {
	view.setFloat64(0, value);
	return ((view.getUint16(0) & 0b0111111111110000) >> 4) - 1023;
};

/**
 * @private
 * Returns the midpoint of two double-precision floating-point numbers using exponent for faster converge.
 * @param value1 - The first value.
 * @param value2 - The second value.
 * @returns The midpoint of the two values.
 */
const midpointDouble = (value1: number, value2: number): number => {
	const exponent1 = getExponent(value1);
	const exponent2 = getExponent(value2);
	const diff = Math.abs(exponent1 - exponent2);
	if (diff <= 1) return value1 / 2 + value2 / 2;
	if (value1 !== 0 && value2 !== 0 && value1 > 0 !== value2 > 0) return 0;
	return (exponent1 > exponent2 ? value1 : value2) * 2 ** -(diff / 2);
};

/**
 * @private
 * Determines whether the binary search should continue based on the ulp of current values.
 * @param value1 - The first value.
 * @param value2 - The second value.
 * @returns `true` if the search should continue, `false` otherwise.
 */
const shouldContinueDouble = (value1: number, value2: number): boolean => {
	const max = Math.max(Math.abs(value1), Math.abs(value2));
	const ulp = 2 ** (getExponent(max) - 52) || Number.MIN_VALUE;
	const diff = Math.abs(value1 - value2);
	return diff > ulp;
};

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
 * @param epsilon - The maximum acceptable error margin for the search. By default (`"auto"`), use the limit precision of double-precision floating-point values.
 * @param safety - Controls runtime checks. Use `"nocheck"` to skip parameter checks.
 * @returns The boundary value that satisfies the condition.
 * @throws {RangeError} If invalid values or conditions are specified (unless `safety` is `"nocheck"`).
 */
export const binarySearchDouble = (
	alwaysEnd: number,
	neverEnd: number,
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
	 * - "auto" (default): the limit precision of double‑precision floating‑point values.
	 * @default "auto"
	 */
	epsilon: number | "auto" = "auto",
	/** @default "check" */
	safety: "check" | "nocheck" = "check",
): number => {
	if (epsilon === "auto") {
		if (safety === "check") {
			if (!Number.isFinite(alwaysEnd) || !Number.isFinite(neverEnd)) {
				throw new RangeError("alwaysEnd and neverEnd must be finite numbers");
			}
		}
		return binarySearchGeneralized(
			alwaysEnd,
			neverEnd,
			predicate,
			midpointDouble,
			shouldContinueDouble,
			safety,
		);
	}

	return binarySearch(
		alwaysEnd,
		neverEnd,
		predicate,
		midpointDouble,
		epsilon,
		safety,
	);
};

/**
 * @private
 * @returns The index of the nearest element. If not found, returns -1 if `findLast` is true, or `sortedArray.length` if `findLast` is false.
 * @remarks Assumes `sortedArray.length >= 2`. Callers handle length 0 or 1.
 */
const _binarySearchArrayInsertion = <T>(
	findLast: boolean,
	sortedArray: ArrayLike<T>,
	target: T,
	compareFn?: (a: T, b: T) => number,
): number => {
	const alwaysEnd = findLast ? 0 : sortedArray.length - 1;
	const neverEnd = findLast ? sortedArray.length - 1 : 0;
	const notFound = findLast ? -1 : sortedArray.length;
	const nextToNeverEnd = findLast ? sortedArray.length - 2 : 1;
	let predicate: (index: number) => boolean;
	if (compareFn == null) {
		// biome-ignore lint/style/noNonNullAssertion: array must have at least two elements
		const isAsc = sortedArray[0]! < sortedArray[sortedArray.length - 1]!;
		if (isAsc === findLast) {
			// biome-ignore lint/style/noNonNullAssertion: index is always valid
			predicate = (index: number) => sortedArray[index]! <= target;
		} else {
			// biome-ignore lint/style/noNonNullAssertion: index is always valid
			predicate = (index: number) => sortedArray[index]! >= target;
		}
	} else {
		if (findLast) {
			predicate = (index: number) =>
				// biome-ignore lint/style/noNonNullAssertion: index is always valid
				compareFn(sortedArray[index]!, target) <= 0;
		} else {
			predicate = (index: number) =>
				// biome-ignore lint/style/noNonNullAssertion: index is always valid
				compareFn(sortedArray[index]!, target) >= 0;
		}
	}

	const index = binarySearchInteger(alwaysEnd, neverEnd, predicate, "nocheck");

	// Avoid edge cases (alwaysEnd does not satisfy the condition)
	if (index === alwaysEnd && !predicate(alwaysEnd)) return notFound;
	// Avoid edge cases (neverEnd satisfies the condition)
	if (index === nextToNeverEnd && predicate(neverEnd)) return neverEnd;

	return index;
};

/**
 * @private
 */
const _binarySearchArrayFindIndex = (
	findLast: boolean,
	sortedArray: ArrayLike<unknown>,
	target: unknown,
	compareFn?: (a: unknown, b: unknown) => number,
) => {
	if (sortedArray.length === 0) return -1;
	if (sortedArray.length === 1) {
		if (compareFn == null) return sortedArray[0] === target ? 0 : -1;
		// biome-ignore lint/style/noNonNullAssertion: array must have at least one element
		return compareFn(sortedArray[0]!, target) === 0 ? 0 : -1;
	}

	const index = _binarySearchArrayInsertion(
		findLast,
		sortedArray,
		target,
		compareFn,
	);
	if (index === -1 || index === sortedArray.length) return -1;

	if (compareFn == null) {
		if (sortedArray[index] !== target) return -1;
	}
	// biome-ignore lint/style/noNonNullAssertion: index is always valid
	else if (compareFn(sortedArray[index]!, target) !== 0) {
		return -1;
	}

	return index;
};

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
export const binarySearchArray: {
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
	<T>(
		sortedArray: ArrayLike<T>,
		target: T,
		/**
		 * A function that compares two values, which was used to sort the array.
		 * @param a - The first value.
		 * @param b - The second value.
		 * @returns A negative number if `a` comes before `b`, a positive number if `a` comes after `b`, and zero if they are equal.
		 */
		compareFn: (a: T, b: T) => number,
	): number;
} = (
	sortedArray: ArrayLike<unknown>,
	target: unknown,
	compareFn?: (a: unknown, b: unknown) => number,
): number => {
	return _binarySearchArrayFindIndex(false, sortedArray, target, compareFn);
};

/**
 * Alias of {@link binarySearchArray}
 */
export const bsFindIndex = binarySearchArray;

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
export const binarySearchArrayLast: {
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
	<T>(
		sortedArray: ArrayLike<T>,
		target: T,
		/**
		 * A function that compares two values, which was used to sort the array.
		 * @param a - The first value.
		 * @param b - The second value.
		 * @returns A negative number if `a` should be ordered before `b`, a positive number if it should be ordered after, and zero if they are equal.
		 */
		compareFn: (a: T, b: T) => number,
	): number;
} = (
	sortedArray: ArrayLike<unknown>,
	target: unknown,
	compareFn?: (a: unknown, b: unknown) => number,
): number => {
	return _binarySearchArrayFindIndex(true, sortedArray, target, compareFn);
};

/**
 * Alias of {@link binarySearchArrayLast}
 */
export const bsFindLastIndex = binarySearchArrayLast;

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
export const binarySearchArrayInsertionLeft: {
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
	(
		sortedArray: ArrayLike<number>,
		target: number,
		order?: "asc" | "desc",
	): number;
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
	(
		sortedArray: ArrayLike<bigint>,
		target: bigint,
		order?: "asc" | "desc",
	): number;
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
	(
		sortedArray: ArrayLike<string>,
		target: string,
		order?: "asc" | "desc",
	): number;
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
	<T>(
		sortedArray: ArrayLike<T>,
		target: T,
		compareFn: (a: T, b: T) => number,
	): number;
} = (
	sortedArray: ArrayLike<unknown>,
	target: unknown,
	order?: "asc" | "desc" | ((a: unknown, b: unknown) => number),
): number => {
	if (sortedArray.length === 0) return 0;
	if (sortedArray.length === 1) {
		if (typeof order === "function") {
			// biome-ignore lint/style/noNonNullAssertion: sortedArray has at least one element
			return order(sortedArray[0]!, target) > 0 ? 1 : 0;
		}
		if (order === "asc") {
			// biome-ignore lint/style/noNonNullAssertion: sortedArray has at least one element
			return (target as number | bigint | string) > sortedArray[0]! ? 1 : 0;
		}
		if (order === "desc") {
			// biome-ignore lint/style/noNonNullAssertion: sortedArray has at least one element
			return (target as number | bigint | string) < sortedArray[0]! ? 1 : 0;
		}
		throw new RangeError("order must be specified for single-element arrays");
	}
	return _binarySearchArrayInsertion(
		false,
		sortedArray,
		target,
		typeof order === "function" ? order : undefined,
	);
};

/**
 * Alias of {@link binarySearchArrayInsertionLeft}
 */
export const bsInsertionLeft = binarySearchArrayInsertionLeft;

/**
 * Alias of {@link binarySearchArrayInsertionLeft}
 */
export const bsLowerBound = binarySearchArrayInsertionLeft;

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
export const binarySearchArrayInsertionRight: {
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
	(
		sortedArray: ArrayLike<number>,
		target: number,
		order?: "asc" | "desc",
	): number;
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
	(
		sortedArray: ArrayLike<bigint>,
		target: bigint,
		order?: "asc" | "desc",
	): number;
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
	(
		sortedArray: ArrayLike<string>,
		target: string,
		order?: "asc" | "desc",
	): number;
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
	<T>(
		sortedArray: ArrayLike<T>,
		target: T,
		compareFn: (a: T, b: T) => number,
	): number;
} = (
	sortedArray: ArrayLike<unknown>,
	target: unknown,
	order?: "asc" | "desc" | ((a: unknown, b: unknown) => number),
): number => {
	if (sortedArray.length === 0) return 0;
	if (sortedArray.length === 1) {
		if (typeof order === "function") {
			// biome-ignore lint/style/noNonNullAssertion: sortedArray has at least one element
			return order(sortedArray[0]!, target) >= 0 ? 1 : 0;
		}
		if (order === "asc") {
			// biome-ignore lint/style/noNonNullAssertion: sortedArray has at least one element
			return (target as number | bigint | string) >= sortedArray[0]! ? 1 : 0;
		}
		if (order === "desc") {
			// biome-ignore lint/style/noNonNullAssertion: sortedArray has at least one element
			return (target as number | bigint | string) <= sortedArray[0]! ? 1 : 0;
		}
		throw new RangeError("order must be specified for single-element arrays");
	}
	return (
		_binarySearchArrayInsertion(
			true,
			sortedArray,
			target,
			typeof order === "function" ? order : undefined,
		) + 1
	);
};

/**
 * Alias of {@link binarySearchArrayInsertionRight}
 */
export const bsInsertionRight = binarySearchArrayInsertionRight;

/**
 * Alias of {@link binarySearchArrayInsertionRight}
 */
export const bsUpperBound = binarySearchArrayInsertionRight;

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
export const binarySearchGeneralized = <T>(
	alwaysEnd: T,
	neverEnd: T,
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
	safety: "check" | "nocheck" = "check",
): T => {
	if (safety === "check") {
		if (!predicate(alwaysEnd)) {
			throw new RangeError("alwaysEnd must satisfy the condition");
		}
		if (predicate(neverEnd)) {
			throw new RangeError("neverEnd must not satisfy the condition");
		}
	}

	let always = alwaysEnd;
	let never = neverEnd;

	while (shouldContinue(always, never)) {
		const middle = midpoint(always, never);
		if (predicate(middle)) always = middle;
		else never = middle;
	}

	return always;
};
