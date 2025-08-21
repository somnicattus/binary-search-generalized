# binary-search-generalized

[![npm version](https://img.shields.io/npm/v/binary-search-generalized.svg?color=blue)](https://www.npmjs.com/package/binary-search-generalized)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![types](https://img.shields.io/badge/types-TypeScript-blue)](./dist/index.d.ts)

Generalized binary search implementation for TypeScript/JavaScript: numbers, bigints, sorted arrays (asc/desc; with or without custom comparators), and even non‑primitive domains via a pluggable midpoint.

- Ultra-generalized, customizable binary search implementation for any use case
- Precisely controlled API for integers, double-precision floats, bigints, and arrays
- Automatically handles both ascending and descending order
- ESM-first, TypeScript-native, and fully documented

## Install

Requires Node.js >= 20. ESM only.

```bash
# npm
npm install binary-search-generalized

# pnpm
pnpm add binary-search-generalized

# bun
bun add binary-search-generalized
```

## Quick start

```ts
import {
  binarySearchInteger,
  binarySearchDouble,
  binarySearchArray,
  binarySearchArrayLast,
  binarySearchArrayInsertionLeft,
  binarySearchArrayInsertionRight,
} from "binary-search-generalized";

// Largest integer whose square <= 180 -> 13
const n = binarySearchInteger(0, 100, v => v * v <= 180);

// Double search with precision (epsilon)
const angle = binarySearchDouble(0, Math.PI / 2, v => Math.sin(v) <= 0.5);
// ~= Math.PI / 6

// Find in sorted arrays
binarySearchArray(["apple", "banana", "cherry"], "cherry"); // 2
binarySearchArray([9, 7, 7, 5, 3], 7); // 1 (descending handled)

// First/last occurrence with duplicates
binarySearchArray([1, 2, 2, 2, 3], 2); // 1 (first)
binarySearchArrayLast([1, 2, 2, 2, 3], 2); // 3 (last)
// Aliases:
// bsFindIndex === binarySearchArray
// bsFindLastIndex === binarySearchArrayLast

// Insertion points
binarySearchArrayInsertionLeft([1, 3, 3, 5], 3); // 1 (before first 3)
binarySearchArrayInsertionRight([1, 3, 3, 5], 3); // 3 (after last 3)
// Aliases:
// bsInsertionLeft === binarySearchArrayInsertionLeft
// bsInsertionRight === binarySearchArrayInsertionRight
```

## API

### Numeric

Find a numeric value in a specified range. All functions can search ascending or descending ranges and returns the boundary value on the "always" side.

- `binarySearchInteger(alwaysEnd, neverEnd, predicate, safety?) → number`
  - Integer search with midpoint `floor(low / 2 + high / 2)` and epsilon `1`.
  - Inputs must be safe integers (`Number.isSafeInteger`).
- `binarySearchBigint(alwaysEnd, neverEnd, predicate, safety?) → bigint`
  - Bigint variant with epsilon `1n`.
- `binarySearchDouble(alwaysEnd, neverEnd, predicate, epsilon?, safety?) → number`
  - Floating search with precision control.
  - When omitted, `epsilon` defaults to `max(|alwaysEnd|, |neverEnd|) * EPSILON` (`EPSILON` is 2^-52).
  - `epsilon` must be positive and representable at the magnitude of the endpoints.
- `binarySearch(alwaysEnd, neverEnd, predicate, midpoint, epsilon, safety?) → number | bigint`
  - Generalized to any set of primitive-number `number`/`bigint` with `midpoint(low, high)`.
  - `midpoint` must strictly shrink the interval each loop (return a value between low and high that moves one boundary) to guarantee termination.
- `binarySearchGeneralized(alwaysEnd, neverEnd, predicate, midpoint, shouldContinue, safety?) → T`
  - Generalized to any type `T` (e.g., `BigNumber` from bignumber.js).
  - You provide a `shouldContinue(always, never)` loop condition instead of `epsilon`.

#### Preconditions for Numeric API

- All functions assume a monotonic `predicate` across the search range: once the `predicate` becomes true (or false), it stays that way.
- `alwaysEnd` must satisfy `predicate`; `neverEnd` must not.
- `safety: "nocheck"` disables safety checks including number ranges and `predicate` against `alwaysEnd`/`neverEnd`.

### Array

Find an index in an array and target element. All functions can search ascending or descending ranges.
Overloads for `number | bigint | string` or a custom comparator for arbitrary objects.

- `binarySearchArray(sortedArray, target, compareFn?) → number`
  - Returns the first index if there are duplicates; -1 if not found. Works for both ascending and descending arrays automatically.
- `binarySearchArrayLast(sortedArray, target, compareFn?) → number`
  - Like binarySearchArray, but returns the last index for duplicates; -1 if not found.
- `binarySearchArrayInsertionLeft(sortedArray, target, orderOrCompare?) → number`
  - Left insertion point (before the first equal element).
  - For single-element arrays, pass `order: "asc" | "desc"`, or a comparator.
- `binarySearchArrayInsertionRight(sortedArray, target, orderOrCompare?) → number`
  - Right insertion point (after the last equal element).
  - Same single-element array note as above.

#### Preconditions for Array API

- All functions assume a sorted array.
  - Without `compareFn`, all functions assume elements are sorted along JavaScript comparator `>`,  `<` and `=`.
  - With `compareFn`, all functions assume elements are sorted with `compareFn`.
- Order (asc/desc) is detected automatically for arrays with `length >= 2` when no comparator is provided.
  - For insertion helpers and `length = 1`, you must specify `order` (`"asc" | "desc"`) or pass a `compareFn`, otherwise a `RangeError` is thrown.

## Common pitfalls

- Non‑monotonic predicate: `predicate` must not flip true/false multiple times across the range. If it’s not monotonic, results are undefined.
- Midpoint not shrinking: a custom `midpoint` that returns `low` or `high` can cause infinite loops. Ensure it strictly reduces the interval (e.g., for integers use `Math.floor(low / 2 + high / 2)` and design your predicate so a bound moves).
- Epsilon too small or not representable: pick an `epsilon` that’s meaningful at the magnitude of the endpoints; values below the local ulp won’t change bounds and will throw in `"check"` mode.
- Invalid endpoints: `alwaysEnd` must satisfy `predicate` and `neverEnd` must not (or vice‑versa for descending); otherwise a `RangeError` is thrown in `"check"` mode.
- Arrays not truly sorted / comparator mismatch: if the array isn’t sorted according to the provided comparator (or natural order), results are undefined. Auto asc/desc detection requires `length >= 2`.
- Single‑element arrays: for insertion helpers, pass `order` (`"asc" | "desc`") or a `compareFn`; otherwise a `RangeError` is thrown.
- Duplicates: `binarySearchArray` returns the first index; use `binarySearchArrayLast` for the last index. Choose left/right insertion helpers depending on where you want to insert equal values.
- Mixed types or NaN: avoid mixing numbers with `NaN` or incompatible types. For bigint arrays, don’t mix with number.
- Convergence: pair `midpoint` with `epsilon` and `shouldContinue` condition so the loop converges.

## Examples

Numbers (integers):

```ts
import { binarySearchInteger } from "binary-search-generalized";
// Largest k with k^2 <= 180
const k = binarySearchInteger(0, 100, v => v * v <= 180); // 13
```

Bigint:

```ts
import { binarySearchBigint } from "binary-search-generalized";
// Smallest x with 2^x >= 10^21
const x = binarySearchBigint(100n, 0n, v => (2n ** v) >= (10n ** 21n)); // 70n
```

Double-precision floats:

```ts
import { binarySearchDouble } from "binary-search-generalized";
const res = binarySearchDouble(0, Math.PI / 2, v => Math.sin(v) <= 0.5);
// res ≈ Math.PI / 6
```

Sorted arrays (primitive values):

```ts
import { binarySearchArray, binarySearchArrayLast } from "binary-search-generalized";
const arr = [1, 2, 2, 2, 3];
binarySearchArray(arr, 2);      // 1 (first)
binarySearchArrayLast(arr, 2);  // 3 (last)
```

Sorted arrays (custom objects):

```ts
import { binarySearchArray } from "binary-search-generalized";
const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
const cmp = (a: { id: number }, b: { id: number }) => a.id - b.id;
binarySearchArray(arr, { id: 2 }, cmp); // 1
```

Insertion points (primitive values):

```ts
import { binarySearchArrayInsertionLeft, binarySearchArrayInsertionRight } from "binary-search-generalized";
const arr = [1, 3, 3, 5];
const left = binarySearchArrayInsertionLeft(arr, 3);   // 1
const right = binarySearchArrayInsertionRight(arr, 3); // 3

// Single-element arrays require explicit order when no comparator is provided
binarySearchArrayInsertionLeft([5], 4, "asc");  // 0
binarySearchArrayInsertionRight([5], 5, "asc"); // 1
```

Insertion points (custom objects):

```ts
import { binarySearchArrayInsertionLeft, binarySearchArrayInsertionRight } from "binary-search-generalized";
const objs = [{ v: 1 }, { v: 3 }, { v: 3 }, { v: 5 }];
const cmpObj = (a: { v: number }, b: { v: number }) => a.v - b.v;
binarySearchArrayInsertionLeft(objs, { v: 3 }, cmpObj);   // 1
binarySearchArrayInsertionRight(objs, { v: 3 }, cmpObj);  // 3
```

Generalized domain (`BigNumber`):

```ts
import BigNumber from "bignumber.js"
import { binarySearchGeneralized } from "binary-search-generalized";
const found = binarySearchGeneralized(
  new BigNumber('0'),
  new BigNumber('1000000000000000'),
  v => v.isLessThan('100000000'),
  // Use an integer midpoint to pair with the termination rule below
  (a, b) => a.plus(b).dividedBy(2).integerValue(BigNumber.ROUND_FLOOR),
  // Continue while the gap is > 1 to ensure convergence with the midpoint rounding
  (a, b) => b.minus(a).isGreaterThan(1),
); // BigNumber('99999999')
```

## License

[MIT](./LICENSE)
