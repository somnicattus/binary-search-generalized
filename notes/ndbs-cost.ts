// This file is notebook, not script or module, non-executable.

declare const predicate: number; // Predicate evaluation cost
declare const continuation: number; // continuation evaluation cost
declare const midpoint: number; // midpoint evaluation cost

declare const Sum: (
	start: number,
	end: number,
	fn: (i: number) => number,
) => number;
declare const Combination: (n: number, k: number) => number;
declare const Log2: (x: number) => number;
declare const Exp2: (x: number) => number;

/** number of dimensions */
declare const D: number;

/** dimension lengths (ascending order) */
const l = [1];
// l[n] >= l(n-1)
// l[0] = 1

/** dimension lengths ratios */
// biome-ignore lint/style/noNonNullAssertion: d must be valid dimension index
const r = (d: number) => l[d]! / l[d - 1]!;

const _pointsPerCellInner = (d: number, k: number) =>
	// Select k dimensions, get farthest points in (d - k) dimensions ("combinations of dimensions")
	Combination(d, k) /
	// Each point is evaluated if it doesn't include already determined "combinations of dimensions"
	Exp2(Sum(1, k - 1, (j) => _pointsPerCellInner(d, j)));

/** Calculate the expected number of evaluated points for each rectangular cell in a d-dimensional space */
const pointsPerCell = (d: number) =>
	Sum(0, d - 1, (k) => _pointsPerCellInner(d, k));

/** Calculate the expected total number of rectangular cells computed in a d-dimensional space */
const numberOfCells = (d: number) =>
	Sum(1, Log2(r(d)), (i) => Exp2((d - 1) * i));

// numberOfCells = Sum(1, Log2(r(d)), (i) => Exp2((d - 1) * i))
// = (Exp2((d - 1) ** (Log2(r(d)) + 1)) - 1) / (Exp2(d - 1) - 1) - 1;
// = (Exp2(d - 1) * r(d) ** (d - 1) - 1) / (Exp2(d - 1) - 1) - 1;
// = (Exp2(d - 1) * (r(d) ** (d - 1) - 1)) / (Exp2(d - 1) - 1);

const expectedCalculationsForD = (d: number) =>
	numberOfCells(d) * (predicate * pointsPerCell(d) + continuation + midpoint);

const expectedCalculations = () =>
	Sum(1, D, (d) => expectedCalculationsForD(d));
