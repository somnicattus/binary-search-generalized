# binary-search-generalized

[![npm version](https://img.shields.io/npm/v/binary-search-generalized.svg?color=blue)](https://www.npmjs.com/package/binary-search-generalized)
[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![types](https://img.shields.io/badge/types-TypeScript-blue)](./dist/index.d.ts)

Generalized binary search utilities for TypeScript/JavaScript: numbers, bigints, sorted arrays (asc/desc, with or without custom comparators), and even non-primitive domains like Date via a pluggable midpoint.

- Fast (O(log n)) and allocation-free
- Works with ascending and descending arrays automatically
- Precise control for integers, bigints, and doubles
- Insertion points (left/right) and first/last occurrence helpers
- ESM-first, TypeScript types included

## Why this

- Asc/desc arrays auto-detected (length ≥ 2) without extra parameters
- First/last occurrence helpers and left/right insertion points
- Works with number, bigint, string, custom comparators, and generalized domains (e.g., Date)
- Safety checks with helpful RangeErrors (configurable via safety: "check" | "nocheck")
- ESM-only, TypeScript types, zero external dependencies

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
const angle = binarySearchDouble(0, Math.PI / 2, v => Math.sin(v) <= 0.5, 5e-4);
// ~= Math.PI / 6

// Find in sorted arrays
binarySearchArray(["apple", "banana", "cherry"], "cherry"); // 2
binarySearchArray([9, 7, 7, 5, 3], 7); // 1 (descending handled)

// First/last occurrence with duplicates
binarySearchArray([1, 2, 2, 2, 3], 2); // 1 (first)
binarySearchArrayLast([1, 2, 2, 2, 3], 2); // 3 (last)

// Insertion points
binarySearchArrayInsertionLeft([1, 3, 3, 5], 3); // 1 (before first 3)
binarySearchArrayInsertionRight([1, 3, 3, 5], 3); // 3 (after last 3)
// For single-element arrays, pass order ("asc" | "desc") or a comparator.
```

## API

### Numeric

All functions assume a monotonic predicate across the search range: once the predicate becomes true (or false), it stays that way.

- binarySearchInteger(alwaysEnd, neverEnd, predicate, safety?) → number
  - Integer search with midpoint floor((low + high)/2). Returns the boundary value.
  - alwaysEnd must satisfy predicate; neverEnd must not. Can search ascending or descending ranges.
  - Inputs must be safe integers (Number.isSafeInteger) in `safety: "check"` mode; otherwise a RangeError is thrown.
- binarySearchBigint(alwaysEnd, neverEnd, predicate, safety?) → bigint
  - Bigint variant with midpoint (low + high) / 2n.
- binarySearchDouble(alwaysEnd, neverEnd, predicate, epsilon, safety?) → number
  - Floating search with precision control. epsilon must be > 0 and representable at the magnitude of the endpoints.
- binarySearch(alwaysEnd, neverEnd, predicate, midpoint, epsilon, safety?) → number | bigint
  - Low-level primitive-number/generalized midpoint variant for number/bigint ranges.
  - Midpoint must strictly shrink the interval each loop (return a value between low and high that moves one boundary) to guarantee termination.
- binarySearchGeneralized(alwaysEnd, neverEnd, predicate, midpoint, shouldContinue, safety?) → T
  - Generalized to any type T (e.g., Date). You provide midpoint and a shouldContinue(always, never) loop condition.

### Array

- binarySearchArray(sortedArray, target) → number
  - Overloads for number | bigint | string or a custom comparator for arbitrary objects.
  - Returns the first index if there are duplicates; -1 if not found. Works for both ascending and descending arrays automatically.
- binarySearchArrayLast(sortedArray, target) → number
  - Like binarySearchArray, but returns the last index for duplicates; -1 if not found.
- binarySearchArrayInsertionLeft(sortedArray, target, orderOrCompare?) → number
  - Left insertion point (before the first equal element). For single-element arrays, pass order: "asc" | "desc", or a comparator.
- binarySearchArrayInsertionRight(sortedArray, target, orderOrCompare?) → number
  - Right insertion point (after the last equal element). Same single-element array note as above.
  

### Parameters and behaviors

- alwaysEnd, neverEnd
  - One endpoint must always satisfy the predicate (alwaysEnd), the other must never satisfy (neverEnd). Order may be ascending or descending.
- safety
  - Optional: "check" | "nocheck" (default "check"). In "check" mode, inputs are validated and RangeError is thrown for inconsistent endpoints or invalid epsilon.
- Arrays order detection
  - Order (asc/desc) is detected automatically for arrays with length >= 2 when no comparator is provided.
  - For insertion point against length = 1, order ("asc" | "desc") or compareFn must be specified, or a RangeError is thrown.

### Contract and termination for binarySearch

- Inputs: alwaysEnd (predicate true), neverEnd (predicate false), monotonic predicate, progress-guaranteeing midpoint, epsilon > 0 (or 1/1n for integer/bigint variants).
- Termination: ensure midpoint(low, high) moves one of the bounds every iteration; otherwise the search may not converge.

## Common pitfalls

- Non‑monotonic predicate: `predicate` must not flip true/false multiple times across the range. If it’s not monotonic, results are undefined.
- Midpoint not shrinking: a custom `midpoint` that returns `low` or `high` can cause infinite loops. Ensure it strictly reduces the interval (e.g., for integers use `Math.floor((low + high)/2)` and design your predicate so a bound moves).
- Epsilon too small or not representable: for doubles, pick an `epsilon` that’s meaningful at the magnitude of the endpoints; values below the local ulp won’t change bounds and will throw in `"check"` mode.
- Invalid endpoints: `alwaysEnd` must satisfy `predicate` and `neverEnd` must not (or vice‑versa for descending); otherwise a RangeError is thrown in `safety: "check"` mode.
- Arrays not truly sorted / comparator mismatch: if the array isn’t sorted according to the provided comparator (or natural order), results are undefined. Auto asc/desc detection requires length ≥ 2.
- Single‑element arrays: for insertion helpers, pass `order` ("asc" | "desc") or a `compareFn`; otherwise a RangeError is thrown.
- Duplicates: `binarySearchArray` returns the first index; use `binarySearchArrayLast` for the last index. Choose left/right insertion helpers depending on where you want to insert equal values.
- Mixed types or NaN: avoid mixing numbers with `NaN` or incompatible types. For bigint arrays, don’t mix with number.
- Generalized domains: when rounding the midpoint (e.g., minutes for Date), pair it with a compatible `shouldContinue` condition so the loop converges.

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

Double with epsilon:
```ts
import { binarySearchDouble } from "binary-search-generalized";
const res = binarySearchDouble(0, Math.PI / 2, v => Math.sin(v) <= 0.5, 5e-4);
// res ≈ Math.PI / 6
```

Sorted arrays (primitive values):
```ts
import { binarySearchArray, binarySearchArrayLast } from "binary-search-generalized";
const arr = [1, 2, 2, 2, 3];
binarySearchArray(arr, 2);      // 1 (first)
binarySearchArrayLast(arr, 2);  // 3 (last)
```

Custom comparator (objects):
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

Insertion points with custom comparator (objects):
```ts
import { binarySearchArrayInsertionLeft, binarySearchArrayInsertionRight } from "binary-search-generalized";
const objs = [{ v: 1 }, { v: 3 }, { v: 3 }, { v: 5 }];
const cmpObj = (a: { v: number }, b: { v: number }) => a.v - b.v;
binarySearchArrayInsertionLeft(objs, { v: 3 }, cmpObj);   // 1
binarySearchArrayInsertionRight(objs, { v: 3 }, cmpObj);  // 3
```

Generalized domain (Date):
```ts
import { binarySearchGeneralized } from "binary-search-generalized";
const start = new Date("1970-01-01T00:00:00Z");
const end = new Date("1970-01-02T00:00:00Z");
const target = new Date("1970-01-01T03:00:00Z").getTime();
const found = binarySearchGeneralized(
  start,
  end,
  v => v.getTime() <= target,
  // Round midpoint to minute resolution so it pairs with the termination rule below
  (a, b) => { const mid = new Date((a.getTime() + b.getTime()) / 2); mid.setUTCSeconds(0, 0); return mid; },
  // Continue while the gap is greater than one minute; ensures convergence with the rounding above
  (a, b) => b.getTime() - a.getTime() > 60_000,
); // Date 1970-01-01T03:00:00Z
```

## TypeScript and ESM

- Fully typed. Import with ESM syntax:
  - import { binarySearchArray } from "binary-search-generalized";
  - const { binarySearchArray } = await import("binary-search-generalized")
- The package exposes ESM only and ships type definitions.

## License

[MIT](./LICENSE)