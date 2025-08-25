# binary-search-generalized

[![npm version](https://img.shields.io/npm/v/binary-search-generalized.svg?color=blue)](https://www.npmjs.com/package/binary-search-generalized)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![types](https://img.shields.io/badge/types-TypeScript-blue)](./dist/index.d.ts)
[![codecov](https://codecov.io/gh/somnicattus/binary-search-generalized/branch/master/graph/badge.svg)](https://codecov.io/gh/somnicattus/binary-search-generalized)

Ultimately generalized binary search for TypeScript/JavaScript: numbers, bigints, sorted arrays, custom domains and N-dimensional search.

- Highly generalized, customizable binary search for many use cases
- Precisely controlled API for integers, double‑precision floats, bigints, and arrays
- Automatically handles both ascending and descending order
- N‑dimensional generalization of grid point search by DFS generator function
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
  binarySearchBigint,
  binarySearch,
  binarySearchGeneralized,
  binarySearchArray,
  binarySearchArrayLast,
  binarySearchArrayInsertionLeft,
  binarySearchArrayInsertionRight,
} from "binary-search-generalized";

// Integer search (e.g. the largest number whose square <= 180)
const n = binarySearchInteger(
  0,
  100,
  v => v * v <= 180,
); // 13

// Floating‑point search
const angle = binarySearchDouble(
  0,
  Math.PI / 2,
  v => Math.sin(v) <= 0.5,
); // ~= Math.PI / 6

// Bigint search
const b = binarySearchBigint(
  100n,
  0n,
  v => (2n ** v) >= (10n ** 21n)
); // 70n

// Custom numeric subset via midpoint/epsilon (e.g. even numbers only)
const even = binarySearch(
  0,
  100,
  v => v * v <= 180,
  (lo, hi) => Math.floor(lo / 4 + hi / 4) * 2,
  2
); // 12

// Custom numeric subset via midpoint/shouldContinue (e.g. power of 2 only)
const base2 = binarySearchGeneralized(
  1,
  2 ** 1023,
  d => d <= 123456789,
  (a, b) => 2 ** Math.floor((Math.log2(a) + Math.log2(b)) / 2),
  (a, b) => b / a > 2, // continue while ratio > 2
); // 2 ** 26

// Custom domain via midpoint/shouldContinue (e.g. BigNumber.js)
const bn = binarySearchGeneralized(
  new BigNumber('0'),
  new BigNumber('1000000000000000'),
  v => v.isLessThan('100000000'),
  (a, b) => a.plus(b).dividedBy(2).integerValue(BigNumber.ROUND_FLOOR),
  (a, b) => b.minus(a).isGreaterThan(1),
); // BigNumber('99999999')

// Find in sorted arrays
const idx1 = binarySearchArray(["apple", "banana", "cherry"], "cherry"); // 2
const idx2 = binarySearchArray([9, 7, 7, 5, 3], 7); // 1 (descending handled)

// First/last occurrence with duplicates
const idx3 = binarySearchArray([1, 2, 2, 2, 3], 2); // 1 (first)
const idx4 = binarySearchArrayLast([1, 2, 2, 2, 3], 2); // 3 (last)
// Aliases:
// bsFindIndex === binarySearchArray
// bsFindLastIndex === binarySearchArrayLast

// Insertion points
const idx5 = binarySearchArrayInsertionLeft([1, 3, 3, 5], 3); // 1 (before first 3)
const idx6 = binarySearchArrayInsertionRight([1, 3, 3, 5], 3); // 3 (after last 3)
// Aliases:
// bsInsertionLeft === binarySearchArrayInsertionLeft
// bsInsertionRight === binarySearchArrayInsertionRight
// bsLowerBound === binarySearchArrayInsertionLeft
// bsUpperBound === binarySearchArrayInsertionRight
```

## API

### Numeric

Find a numeric value in a specified range. All functions can search ascending or descending ranges and return the boundary value on the "always" side.

- `binarySearchInteger(alwaysEnd, neverEnd, predicate, safety?) → number`
  - Integer search with midpoint `floor(low / 2 + high / 2)` and epsilon `1`.
  - Inputs must be safe integers (`Number.isSafeInteger`).
- `binarySearchBigint(alwaysEnd, neverEnd, predicate, safety?) → bigint`
  - Bigint variant with epsilon `1n`.
- `binarySearchDouble(alwaysEnd, neverEnd, predicate, epsilon?, safety?) → number`
  - Floating‑point search with precision control.
  - `epsilon` can be:
    - a positive number: absolute termination gap; must be representable at the scale of the endpoints
    - "auto" (default): uses a ULP‑based termination rule that adapts to the magnitude of the values.
- `binarySearch(alwaysEnd, neverEnd, predicate, midpoint, epsilon, safety?) → number | bigint`
  - Generalized to primitive numeric types (`number`/`bigint`) using a custom `midpoint(low, high)`.
  - `midpoint` must strictly shrink the interval on each iteration (return a value strictly between the bounds so that one boundary moves) to guarantee termination.
  - Supports safety modes: `"check"` (default), `"nocheck"` (skip endpoint precondition), and `"strict"` (validates that the midpoint strictly reduces the interval each iteration).
- `binarySearchGeneralized(alwaysEnd, neverEnd, predicate, midpoint, shouldContinue, safety?) → T`
  - Generalized to any type `T` (e.g., `BigNumber` from bignumber.js).
  - You provide a `shouldContinue(always, never)` loop condition instead of `epsilon`.

#### Preconditions for Numeric API

- All functions assume a monotonic `predicate` across the search range: once the `predicate` becomes true (or false), it stays that way.
- Safety modes:
  - `"check"` (default): validates that `alwaysEnd` satisfies the predicate and `neverEnd` does not.
  - `"nocheck"`: skips the endpoint precondition described above.
  - `"strict"` (only for `binarySearch` over `number`/`bigint`): in addition to `"check"`, validates that each computed midpoint strictly reduces the interval; throws if not.

### Array

Find the index of a target element in an array. All functions can search ascending or descending ranges.
Overloads for `number | bigint | string` or a custom comparator for arbitrary objects.

- `binarySearchArray(sortedArray, target, compareFn?) → number`
  - Returns the first index if there are duplicates; -1 if not found. Works for both ascending and descending arrays automatically.
- `binarySearchArrayLast(sortedArray, target, compareFn?) → number`
  - Like binarySearchArray, but returns the last index for duplicates; -1 if not found.
- `binarySearchArrayInsertionLeft(sortedArray, target, orderOrCompare?) → number`
  - Left insertion point (before the first equal element).
  - For single-element arrays, pass `order` (`"asc" | "desc"`), or a comparator.
- `binarySearchArrayInsertionRight(sortedArray, target, orderOrCompare?) → number`
  - Right insertion point (after the last equal element).
  - Same single-element array note as above.

#### Preconditions for Array API

- All functions assume a sorted array.
  - Without `compareFn`, arrays must be sorted in the natural order of numbers/bigints/strings.
  - With `compareFn`, arrays must be sorted using `compareFn`.
- Order (asc/desc) is detected automatically for arrays with `length >= 2` when no comparator is provided.
  - For arrays of `length = 1`, you must specify `order` (`"asc" | "desc"`) or pass a `compareFn`; otherwise, a `RangeError` is thrown.

### N‑dimensional

Enumerate boundary points of a monotone region in D dimensions.

- `ndBinarySearch(alwaysEnd, neverEnd, predicate, midpoint, shouldContinue) → Iterable<Vector<D, T>>`
  - Yields vectors on the inside border; order is not guaranteed.
  - `alwaysEnd` must satisfy `predicate` and `neverEnd` must not.
  - `midpoint` and `shouldContinue` are arrays of per‑dimension functions of length `D` and must have the same length.
  - Each dimension deactivates when `shouldContinue[i](always[i], never[i])` becomes false; the search stops when all dimensions deactivate.

#### Preconditions for N‑dimensional API

- Predicate monotonicity across the hyper‑rectangle from `alwaysEnd` to `neverEnd`.
- Matching lengths for `midpoint` and `shouldContinue` arrays.
- Per‑dimension midpoint must make progress toward convergence together with its `shouldContinue` rule (e.g., integer midpoint with gap‑based termination).

See also: [README § Technical notes about N‑dimensional search](#technical-notes-about-n-dimensional-search)

## Common pitfalls

- Non‑monotonic predicate: `predicate` must not flip true/false multiple times across the range. If it’s not monotonic, results are undefined.
- Midpoint not shrinking: a custom `midpoint` that returns `low` or `high` can cause infinite loops. Ensure it strictly reduces the interval (e.g., for integers use `Math.floor(low / 2 + high / 2)` and design your predicate so a bound moves).
- Epsilon too small or not representable: pick an `epsilon` that’s meaningful at the magnitude of the endpoints; values below the local ulp won’t change the bounds and will throw in `"check"` mode.
- Invalid endpoints: `alwaysEnd` must satisfy `predicate` and `neverEnd` must not; otherwise a `RangeError` is thrown in `"check"` mode.
- Arrays not truly sorted / comparator mismatch: if the array isn’t sorted according to the provided comparator (or natural order), results are undefined. Auto asc/desc detection requires `length >= 2`.
- Single‑element arrays: for insertion helpers, pass `order` (`"asc" | "desc"`) or a `compareFn`; otherwise a `RangeError` is thrown.
- Duplicates: `binarySearchArray` returns the first index; use `binarySearchArrayLast` for the last index. Choose left/right insertion helpers depending on where you want to insert equal values.
- Mixed types or NaN: avoid mixing numbers with `NaN` or incompatible types. For bigint arrays, don’t mix with numbers.
- Convergence: for custom domains, ensure your `midpoint` and termination condition guarantee convergence.

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
const left = binarySearchArrayInsertionLeft(objs, { v: 3 }, cmpObj);   // 1
const right = binarySearchArrayInsertionRight(objs, { v: 3 }, cmpObj);  // 3
```

Generalized numeric subset (custom midpoint/epsilon):

```ts
import { binarySearch } from "binary-search-generalized";
// Search over even numbers only, for the largest even k with k^2 <= 180
const evenK = binarySearch(
  0,
  100,
  v => v * v <= 180,
  (low, high) => Math.floor(low / 4 + high / 4) * 2, // midpoint is always even
  2, // epsilon is the minimal step between distinct evens
); // 12
```

Generalized numeric subset (custom midpoint/shouldContinue):

```ts
import { binarySearchGeneralized } from "binary-search-generalized";
// Custom numeric subset via midpoint/shouldContinue (e.g. power of 2 only)
const base2 = binarySearchGeneralized(
  1,
  2 ** 1023,
  d => d <= 123456789,
  (a, b) => 2 ** Math.floor((Math.log2(a) + Math.log2(b)) / 2), // midpoint is always power of 2
  (a, b) => b / a > 2, // continue while ratio > 2
); // 2 ** 26
```

Generalized domain (`BigNumber`):

```ts
import BigNumber from "bignumber.js";
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

N‑dimensional search (ndBinarySearch):

Find all grid points on the inside border of a monotone region in N dimensions. The generator function yields vectors on the boundary; order is not guaranteed.

```ts
import {
  ndBinarySearch,
  type Vector,
  type Midpoint,
  type Predicate,
  type ShouldContinue,
} from "binary-search-generalized/nd";

// Quarter circle of radius r in the first quadrant (2D example)
const r = 4;
const always: Vector<2, number> = [0, 0];           // definitely inside
const never: Vector<2, number> = [r, r];            // definitely outside
const predicate: Predicate<2, number> = ([x, y]) => x * x + y * y < r * r;

// Per-dimension midpoint and termination
const mid = (a: number, b: number) => Math.floor((a + b) / 2);
const cont = (a: number, b: number) => b - a > 1;   // continue while gap > 1
const midpoint: Midpoint<2, number> = [mid, mid];
const shouldContinue: ShouldContinue<2, number> = [cont, cont];

const border = [
  ...ndBinarySearch(always, never, predicate, midpoint, shouldContinue),
];
// Example (order not guaranteed):
// [[0,3], [1,3], [2,2], [2,3], [3,0], [3,1], [3,2]]
```

## Technical notes about N-dimensional search

### 2D illustration

See the 2D example below; the same per‑dimension midpoint/termination pattern applies to any D.

![N-dimensional binary search](https://raw.githubusercontent.com/somnicattus/binary-search-generalized/master/images/ndbs.svg)

### How it works (high‑level)

- The algorithm maintains two D‑vectors for a sub‑cell: an “always” point (inside/true) and a “never” point (outside/false). For the current cell it probes the vector midpoint `m(always, never)` component‑wise, evaluates the predicate there, and splits to the side that straddles the boundary.
- It then enumerates all “dimension transition” combinations that actually cross the boundary. For each such combination it recurses only on still‑active dimensions. A dimension is deactivated as soon as its per‑dimension `shouldContinue[i](a, n)` becomes false (e.g., gap ≤ 1 for integer grids).
- The generator yields inside‑border grid points (the “always” corner at convergence). Output order is unspecified and may depend on DFS.
- BFS version is also technically realizable with more time-efficient and less space-efficient.

This is a practical generalization of 1 dimension binary search to N dimensions on a grid.

### Relation to known methods

- 2D sorted‑matrix search (staircase walk) starts from a corner and moves left/down (or up/right) in O(m+n). `ndBinarySearch` instead probes midpoints and divides recursively; it’s conceptually different though both target monotone boundaries.
- It is not a k‑d tree/BSP builder; no spatial index is constructed. It directly enumerates boundary grid points of a monotone decision function.

## License

[MIT](./LICENSE)
