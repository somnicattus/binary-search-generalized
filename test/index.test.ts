import { describe, it, expect } from "bun:test";
import {
	binarySearch,
	binarySearchInteger,
	binarySearchBigint,
	binarySearchDouble,
	binarySearchArray,
	binarySearchArrayLast,
	binarySearchGeneralized,
	binarySearchArrayInsertionLeft,
	binarySearchArrayInsertionRight,
} from "../src/index.js";

describe("binarySearchInteger", () => {
	it("should find the correct integer value", () => {
		const result = binarySearchInteger(0, 100, (value) => value * value <= 180);
		expect(result).toBe(13);
	});

	it("should work with descending order", () => {
		const result = binarySearchInteger(100, 0, (value) => value * value > 180);
		expect(result).toBe(14);
	});

	it("should throw error for invalid condition", () => {
		expect(() => binarySearchInteger(10, 10, (v) => v > 5)).toThrow(
			new RangeError("neverEnd must not satisfy the condition"),
		);
	});

	it("should throw error when alwaysEnd does not satisfy condition", () => {
		expect(() => binarySearchInteger(10, 20, (v) => v < 5)).toThrow(
			new RangeError("alwaysEnd must satisfy the condition"),
		);
	});

	it("should throw error when neverEnd satisfies condition", () => {
		expect(() => binarySearchInteger(0, 10, (v) => v < 20)).toThrow(
			new RangeError("neverEnd must not satisfy the condition"),
		);
	});

	it("throws when endpoints are not safe integers in check mode", () => {
		const unsafe = 2 ** 53; // 9007199254740992 (not safe)
		const safe = Number.MAX_SAFE_INTEGER; // 9007199254740991 (safe)
		expect(() =>
			binarySearchInteger(unsafe, safe, (v: number) => v > 0),
		).toThrow("alwaysEnd and neverEnd must be safe integers");
	});

	it("should not throw for unsafe parameter check", () => {
		expect(binarySearchInteger(10, 20, (v) => v < 5, "nocheck")).toBeDefined();
	});
});

describe("binarySearchBigint", () => {
	it("should find the correct bigint value", () => {
		const result = binarySearchBigint(
			0n,
			10n ** 12n,
			(value) => value ** 2n <= 10n ** 22n,
		);
		expect(result).toBe(10n ** 11n);
	});

	it("should work with descending order", () => {
		const result = binarySearchBigint(
			10n ** 12n,
			0n,
			(value) => value ** 2n >= 10n ** 22n,
		);
		expect(result).toBe(10n ** 11n);
	});

	it("should not throw for unsafe parameter check", () => {
		const result = binarySearchBigint(10n, 20n, (v) => v < 5n, "nocheck");
		expect(result).toBe(10n);
	});
});

describe("binarySearchDouble", () => {
	it("should find the correct double value", () => {
		const result = binarySearchDouble(
			0,
			Math.PI / 2,
			(value) => Math.sin(value) <= 0.5,
			0.0005,
		);
		expect(result).toBeCloseTo(Math.PI / 6, 3);
	});

	it("should work with descending order", () => {
		const result = binarySearchDouble(
			Math.PI / 2,
			0,
			(value) => Math.sin(value) >= 0.5,
			0.0005,
		);
		expect(result).toBeCloseTo(Math.PI / 6, 3);
	});

	it("should throw error when endpoints are infinite", () => {
		expect(() =>
			binarySearchDouble(Number.POSITIVE_INFINITY, 0, (v) => v > 1, 1),
		).toThrow("alwaysEnd, neverEnd, and epsilon must be finite numbers");
	});

	it("should throw error for non-positive epsilon", () => {
		expect(() => binarySearchDouble(0, 1, (v) => v < 0.5, 0)).toThrow(
			"epsilon must be positive",
		);
	});

	describe("epsilon precision checks", () => {
		it("should throw when ends are within epsilon range", () => {
			// |neverEnd - alwaysEnd| < epsilon
			expect(() =>
				binarySearchDouble(0, 0.0009, (v) => v <= 0.0005, 0.001),
			).toThrow(
				"alwaysEnd and neverEnd must be different within the epsilon range",
			);
		});

		it("should throw when epsilon is not representable at the ends' precision", () => {
			// Adding/subtracting epsilon does not change the end values at this magnitude
			expect(() =>
				binarySearchDouble(1e20, 1e20 - 1e10, (v) => v >= 1e20 - 1, 1e-5),
			).toThrow(
				"epsilon must be representable at the precision of alwaysEnd and neverEnd",
			);
		});
	});

	it("should not throw for unsafe parameter check", () => {
		const result = binarySearchDouble(10, 20, (v) => v < 5, 1, "nocheck");
		expect(result).toBe(10);
	});

	it("uses auto epsilon - ascending", () => {
		const always = 0;
		const never = 10;
		const pred = (v: number) => v <= 7.3;
		const result = binarySearchDouble(always, never, pred);
		expect(result).toBe(7.3);
	});

	it("uses auto epsilon - descending", () => {
		const always = 10;
		const never = 0;
		const pred = (v: number) => v >= 7.3;
		const result = binarySearchDouble(always, never, pred);
		expect(result).toBe(7.3);
	});

	it("works for very large magnitudes without passing epsilon", () => {
		const always = 1e20;
		const never = 1e20 - 1e10;
		const res = binarySearchDouble(always, never, (v) => v >= 1e20 - 5e9);
		expect(Number.isFinite(res)).toBe(true);
		// Should be within the original bounds
		expect(res).toBeGreaterThanOrEqual(Math.min(always, never));
		expect(res).toBeLessThanOrEqual(Math.max(always, never));
	});

	it("works for very small magnitudes (subnormal values) without epsilon", () => {
		const always = -Number.MIN_VALUE;
		const never = Number.MIN_VALUE * 64;
		const res = binarySearchDouble(always, never, (v) => v <= 0);
		expect(res).toBe(0);
	});
});

describe("binarySearchArray", () => {
	it("should find the index of a target in a number array", () => {
		const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
		expect(binarySearchArray(arr, 1)).toBe(-1);
		expect(binarySearchArray(arr, 2)).toBe(0);
		expect(binarySearchArray(arr, 20)).toBe(-1);
		expect(binarySearchArray(arr, 23)).toBe(5);
		expect(binarySearchArray(arr, 91)).toBe(9);
		expect(binarySearchArray(arr, 100)).toBe(-1);
	});

	it("should work with descending number array", () => {
		const arr = [91, 72, 56, 38, 23, 16, 12, 8, 5, 2];
		expect(binarySearchArray(arr, 1)).toBe(-1);
		expect(binarySearchArray(arr, 2)).toBe(9);
		expect(binarySearchArray(arr, 20)).toBe(-1);
		expect(binarySearchArray(arr, 23)).toBe(4);
		expect(binarySearchArray(arr, 91)).toBe(0);
		expect(binarySearchArray(arr, 100)).toBe(-1);
	});

	it("should find the index of a target in a string array", () => {
		const arr = ["apple", "banana", "cherry", "date", "fig"];
		expect(binarySearchArray(arr, "cherry")).toBe(2);
		expect(binarySearchArray(arr, "grape")).toBe(-1);
	});

	it("should find the index of a target in a bigint array", () => {
		const arr = [2n, 5n, 8n, 12n, 16n, 23n, 38n, 56n, 72n, 91n];
		expect(binarySearchArray(arr, 23n)).toBe(5);
		expect(binarySearchArray(arr, 100n)).toBe(-1);
	});

	it("should work with custom compare function", () => {
		const arr = [
			{ id: "1", val: 1 },
			{ id: "2", val: 3 },
			{ id: "3", val: 5 },
			{ id: "4", val: 7 },
		];
		expect(
			binarySearchArray<{ val: number }>(
				arr,
				{ val: 5 },
				(a, b) => a.val - b.val,
			),
		).toBe(2);
	});

	it("should return -1 for empty array", () => {
		expect(binarySearchArray([], 1)).toBe(-1);
	});

	describe("first index with duplicates", () => {
		it("should return the first index for duplicates in ascending number array", () => {
			const arr = [1, 2, 2, 2, 3];
			expect(binarySearchArray(arr, 2)).toBe(1);
		});

		it("should return the first index for duplicates in descending number array", () => {
			const arr = [9, 7, 7, 7, 5, 3];
			expect(binarySearchArray(arr, 7)).toBe(1);
		});

		it("should return the first index for duplicates in string array", () => {
			const arr = ["a", "b", "b", "c"];
			expect(binarySearchArray(arr, "b")).toBe(1);
		});

		it("should return the first index for duplicates in bigint array", () => {
			const arr = [1n, 1n, 2n, 2n, 2n, 3n];
			expect(binarySearchArray(arr, 2n)).toBe(2);
		});

		it("should return the first index with a custom comparator", () => {
			const arr = [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }];
			const cmp = (a: { v: number }, b: { v: number }) => a.v - b.v;
			expect(binarySearchArray(arr, { v: 2 }, cmp)).toBe(1);
		});
	});

	it("single-element array without comparator returns 0 or -1 appropriately", () => {
		// Covers single-element fast path without compareFn
		expect(binarySearchArray([5], 5)).toBe(0);
		expect(binarySearchArray([5], 4)).toBe(-1);
	});

	it("single-element array with comparator returns 0 or -1 appropriately", () => {
		// Covers single-element fast path with compareFn
		const cmp = (a: { v: number }, b: { v: number }) => a.v - b.v;
		expect(binarySearchArray([{ v: 5 }], { v: 5 }, cmp)).toBe(0);
		expect(binarySearchArray([{ v: 5 }], { v: 4 }, cmp)).toBe(-1);
	});

	it("custom comparator returns -1 when nearest index is not equal", () => {
		// Ensures branch where index is within bounds but element != target under comparator
		const arr = [{ v: 1 }, { v: 3 }, { v: 5 }];
		const cmp = (a: { v: number }, b: { v: number }) => a.v - b.v;
		expect(binarySearchArray(arr, { v: 4 }, cmp)).toBe(-1);
	});
});

describe("binarySearchArrayLast", () => {
	it("should return the last index for duplicates in ascending number array", () => {
		const arr = [1, 2, 2, 2, 3];
		expect(binarySearchArrayLast(arr, 2)).toBe(3);
	});

	it("should return the last index for duplicates in descending number array", () => {
		const arr = [9, 7, 7, 7, 5, 3];
		expect(binarySearchArrayLast(arr, 7)).toBe(3);
	});

	it("should return the last index for duplicates in string array", () => {
		const arr = ["a", "b", "b", "c"];
		expect(binarySearchArrayLast(arr, "b")).toBe(2);
	});

	it("should return the last index for duplicates in bigint array", () => {
		const arr = [1n, 1n, 2n, 2n, 2n, 3n];
		expect(binarySearchArrayLast(arr, 2n)).toBe(4);
	});

	it("should return the last index with a custom comparator", () => {
		const arr = [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }];
		const cmp = (a: { v: number }, b: { v: number }) => a.v - b.v;
		expect(binarySearchArrayLast(arr, { v: 2 }, cmp)).toBe(2);
	});

	it("should return -1 for empty array", () => {
		expect(binarySearchArrayLast([], 1)).toBe(-1);
	});

	it("should return -1 when target not found", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(binarySearchArrayLast(arr, 6)).toBe(-1);
	});

	it("should return correct index when unique values", () => {
		const arr = [1, 3, 5, 7, 9];
		expect(binarySearchArrayLast(arr, 5)).toBe(2);
	});
});

describe("binarySearchArrayInsertion", () => {
	it("left insertion index - ascending numbers", () => {
		const arr = [1, 3, 3, 5];
		expect(binarySearchArrayInsertionLeft(arr, 0)).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, 1)).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, 2)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, 3)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, 4)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, 5)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, 6)).toBe(4);
	});

	it("single-element arrays with comparator are handled (left/right)", () => {
		const cmp = (a: { v: number }, b: { v: number }) => a.v - b.v;
		// Left: equality case (covers comparator branch evaluation)
		expect(binarySearchArrayInsertionLeft([{ v: 5 }], { v: 5 }, cmp)).toBe(0);
		// Right: equality case returns 1 for single-element
		expect(binarySearchArrayInsertionRight([{ v: 5 }], { v: 5 }, cmp)).toBe(1);
	});

	it("right insertion index - ascending numbers", () => {
		const arr = [1, 3, 3, 5];
		expect(binarySearchArrayInsertionRight(arr, 0)).toBe(0);
		expect(binarySearchArrayInsertionRight(arr, 1)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, 2)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, 3)).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, 4)).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, 5)).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, 6)).toBe(4);
	});

	it("left insertion index - descending numbers", () => {
		const arr = [9, 7, 7, 5, 3];
		expect(binarySearchArrayInsertionLeft(arr, 10)).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, 9)).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, 8)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, 7)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, 6)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, 5)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, 4)).toBe(4);
		expect(binarySearchArrayInsertionLeft(arr, 3)).toBe(4);
		expect(binarySearchArrayInsertionLeft(arr, 2)).toBe(5);
	});

	it("right insertion index - descending numbers", () => {
		const arr = [9, 7, 7, 5, 3];
		expect(binarySearchArrayInsertionRight(arr, 10)).toBe(0);
		expect(binarySearchArrayInsertionRight(arr, 9)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, 8)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, 7)).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, 6)).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, 5)).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, 4)).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, 3)).toBe(5);
		expect(binarySearchArrayInsertionRight(arr, 2)).toBe(5);
	});

	it("single-element arrays require order", () => {
		expect(() => binarySearchArrayInsertionLeft([1], 1)).toThrow(
			"order must be specified for single-element arrays",
		);
		expect(() => binarySearchArrayInsertionRight([1], 1)).toThrow(
			"order must be specified for single-element arrays",
		);
	});

	it("single-element arrays work with order asc/desc", () => {
		expect(binarySearchArrayInsertionLeft([5], 5, "asc")).toBe(0);
		expect(binarySearchArrayInsertionLeft([5], 6, "asc")).toBe(1);
		expect(binarySearchArrayInsertionLeft([5], 4, "asc")).toBe(0);
		expect(binarySearchArrayInsertionLeft([5], 5, "desc")).toBe(0);
		expect(binarySearchArrayInsertionLeft([5], 6, "desc")).toBe(0);
		expect(binarySearchArrayInsertionLeft([5], 4, "desc")).toBe(1);

		expect(binarySearchArrayInsertionRight([5], 5, "asc")).toBe(1);
		expect(binarySearchArrayInsertionRight([5], 6, "asc")).toBe(1);
		expect(binarySearchArrayInsertionRight([5], 4, "asc")).toBe(0);
		expect(binarySearchArrayInsertionRight([5], 5, "desc")).toBe(1);
		expect(binarySearchArrayInsertionRight([5], 6, "desc")).toBe(0);
		expect(binarySearchArrayInsertionRight([5], 4, "desc")).toBe(1);
	});

	it("empty arrays return 0 for insertion helpers", () => {
		expect(binarySearchArrayInsertionLeft([], 123)).toBe(0);
		expect(binarySearchArrayInsertionRight([], 123)).toBe(0);
	});

	it("bigints", () => {
		const arr = [1n, 3n, 3n, 5n];
		expect(binarySearchArrayInsertionLeft(arr, 0n)).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, 1n)).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, 2n)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, 3n)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, 4n)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, 5n)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, 6n)).toBe(4);

		expect(binarySearchArrayInsertionRight(arr, 0n)).toBe(0);
		expect(binarySearchArrayInsertionRight(arr, 1n)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, 2n)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, 3n)).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, 4n)).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, 5n)).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, 6n)).toBe(4);
	});

	it("strings", () => {
		const arr = ["apple", "banana", "banana", "cherry"];
		expect(binarySearchArrayInsertionLeft(arr, "date")).toBe(4);
		expect(binarySearchArrayInsertionLeft(arr, "apple")).toBe(0);
		expect(binarySearchArrayInsertionLeft(arr, "banana")).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, "cherry")).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, "blueberry")).toBe(3);

		expect(binarySearchArrayInsertionRight(arr, "date")).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, "apple")).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, "banana")).toBe(3);
		expect(binarySearchArrayInsertionRight(arr, "cherry")).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, "blueberry")).toBe(3);
	});

	it("custom comparator objects", () => {
		const arr = [{ v: 1 }, { v: 3 }, { v: 3 }, { v: 5 }];
		const cmp = (a: { v: number }, b: { v: number }) => a.v - b.v;
		expect(binarySearchArrayInsertionLeft(arr, { v: 3 }, cmp)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, { v: 3 }, cmp)).toBe(3);
		expect(binarySearchArrayInsertionLeft(arr, { v: 2 }, cmp)).toBe(1);
		expect(binarySearchArrayInsertionRight(arr, { v: 2 }, cmp)).toBe(1);
		expect(binarySearchArrayInsertionLeft(arr, { v: 6 }, cmp)).toBe(4);
		expect(binarySearchArrayInsertionRight(arr, { v: 0 }, cmp)).toBe(0);
	});
});

describe("binarySearch", () => {
	it("should perform a generalized binary search", () => {
		const result = binarySearch(
			0,
			100,
			(value) => value ** 2 <= 180,
			(low, high) => Math.floor((low + high) / 4) * 2,
			2,
		);
		expect(result).toBe(12);
	});

	it("should handle bigint", () => {
		const result = binarySearch(
			0n,
			100n,
			(value) => value * value <= 180n,
			(low, high) => (low + high) / 2n,
			1n,
		);
		expect(result).toBe(13n);
	});

	it("throws when epsilon is non-positive (number)", () => {
		expect(() =>
			binarySearch(
				0,
				1,
				(v: number) => v <= 0.5,
				(l, h) => l + (h - l) / 2,
				0,
			),
		).toThrow("epsilon must be positive");
	});

	it("throws when epsilon is non-positive (bigint)", () => {
		expect(() =>
			binarySearch(
				0n,
				10n,
				(v: bigint) => v <= 5n,
				(l, h) => (l + h) / 2n,
				0n,
			),
		).toThrow("epsilon must be positive");
	});

	it("throws when ends are within epsilon range (number)", () => {
		expect(() =>
			binarySearch(
				0,
				0.0009,
				(v: number) => v <= 0.0005,
				(l, h) => l + (h - l) / 2,
				0.001,
			),
		).toThrow(
			"alwaysEnd and neverEnd must be different within the epsilon range",
		);
	});

	it("throws when ends are within epsilon range (bigint)", () => {
		expect(() =>
			binarySearch(
				0n,
				9n,
				(v: bigint) => v <= 5n,
				(l, h) => (l + h) / 2n,
				10n,
			),
		).toThrow(
			"alwaysEnd and neverEnd must be different within the epsilon range",
		);
	});

	it("throws when epsilon not representable at endpoints' precision.", () => {
		expect(() =>
			binarySearch(
				1e20,
				1e20 - 1e10,
				(v: number) => v >= 1e20 - 1,
				(l, h) => l + (h - l) / 2,
				1e-5,
			),
		).toThrow(
			"epsilon must be representable at the precision of alwaysEnd and neverEnd",
		);
	});

	it("should throw error when endpoints are infinite", () => {
		expect(() =>
			binarySearch(
				Number.POSITIVE_INFINITY,
				0,
				(v) => v > 1,
				(l, h) => l + (h - l) / 2,
				1,
			),
		).toThrow("alwaysEnd, neverEnd, and epsilon must be finite numbers");
	});

	it("should not throw for unsafe parameter check", () => {
		const result = binarySearch(
			10,
			20,
			(v) => v < 5,
			(low, high) => Math.floor((low + high) / 2),
			0,
			"nocheck",
		);
		expect(result).toBe(10);
	});

	it("strict: returns correct value with a shrinking midpoint (number)", () => {
		const result = binarySearch(
			0,
			100,
			(v) => v * v <= 180,
			(l, h) => Math.floor(l + (h - l) / 2),
			1,
			"strict",
		);
		expect(result).toBe(13);
	});

	it("strict: throws when midpoint does not converge (number)", () => {
		expect(() =>
			binarySearch(
				0,
				100,
				(v) => v <= 50,
				(l, _h) => l, // never shrinks
				1,
				"strict",
			),
		).toThrow(/midpoint function did not converge/);
	});

	it("strict: returns correct value with a shrinking midpoint (bigint)", () => {
		const result = binarySearch(
			0n,
			100n,
			(v) => v * v <= 180n,
			(l, h) => (l + h) / 2n,
			1n,
			"strict",
		);
		expect(result).toBe(13n);
	});

	it("strict: throws when midpoint does not converge (bigint)", () => {
		expect(() =>
			binarySearch(
				0n,
				100n,
				(v) => v <= 50n,
				(l, _h) => l, // never shrinks
				1n,
				"strict",
			),
		).toThrow(/midpoint function did not converge/);
	});

	it("throws when alwaysEnd and neverEnd types mismatch (number vs bigint)", () => {
		expect(() =>
			binarySearch(
				0 as unknown as number,
				1n as unknown as number,
				(v: number) => v <= 0.5,
				(l, h) => l + (h - l) / 2,
				1,
			),
		).toThrow("alwaysEnd, neverEnd, and epsilon must be of the same type");
	});

	it("throws when epsilon type mismatches endpoints (number endpoints, bigint epsilon)", () => {
		expect(() =>
			binarySearch(
				0,
				1,
				(v: number) => v <= 0.5,
				(l, h) => l + (h - l) / 2,
				1n as unknown as number,
			),
		).toThrow("alwaysEnd, neverEnd, and epsilon must be of the same type");
	});
});

describe("binarySearchGeneralized", () => {
	it("should find the boundary with Date objects (close to 03:00:00Z)", () => {
		const start = new Date("1970-01-01T00:00:00Z");
		const end = new Date("1970-01-02T00:00:00Z");
		const threeOClock = new Date("1970-01-01T03:00:00Z").getTime();
		const result = binarySearchGeneralized(
			start,
			end,
			(value) => value.getTime() <= threeOClock,
			// Use floor to keep integer milliseconds and ensure convergence to the exact boundary
			(always, never) => {
				const mid = new Date((always.getTime() + never.getTime()) / 2);
				mid.setUTCSeconds(0, 0);
				return mid;
			},
			(always, never) => never.getTime() - always.getTime() > 60_000,
		);
		const t = result.getTime();
		expect(t).toBeGreaterThanOrEqual(threeOClock - 1);
		expect(t).toBeLessThanOrEqual(threeOClock);
	});

	it("should work with numbers in a descending range", () => {
		const res = binarySearchGeneralized<number>(
			100,
			0,
			(v) => v * v >= 180,
			(a, b) => Math.floor(a + (b - a) / 2),
			(a, b) => Math.abs(a - b) > 1,
		);
		// The minimal integer whose square is >= 180 is 14
		expect(res).toBe(14);
	});

	it("should throw when alwaysEnd does not satisfy the condition (with check)", () => {
		expect(() =>
			binarySearchGeneralized<number>(
				0,
				10,
				(v: number) => v >= 5,
				(a, b) => Math.floor(a + (b - a) / 2),
				(a, b) => Math.abs(a - b) > 1,
			),
		).toThrow(new RangeError("alwaysEnd must satisfy the condition"));
	});

	it("should not throw in nocheck mode even if ends are inconsistent", () => {
		const val = binarySearchGeneralized<number>(
			0,
			10,
			(v: number) => v > 5,
			(a, b) => Math.floor(a + (b - a) / 2),
			(a, b) => Math.abs(a - b) > 1,
			"nocheck",
		);
		expect(Number.isFinite(val)).toBe(true);
	});
});
