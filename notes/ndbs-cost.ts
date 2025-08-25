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
const r = (i: number) => l[i]! / l[i - 1]!;

const _pointsPerCellInner = (d: number, k: number) =>
	// Select k dimensions, get farthest points in (d - k) dimensions ("combinations of dimensions")
	Combination(d, k) /
	// Each point is evaluated if it doesn't include already determined "combinations of dimensions"
	Exp2(Sum(1, k - 1, (j) => _pointsPerCellInner(d - 1, j)));

/** Calculate the expected number of evaluated points for each rectangular cell in a d-dimensional space */
const pointsPerCell = (d: number) =>
	Sum(0, d - 1, (k) => _pointsPerCellInner(d, k));

/** Calculate the expected total number of rectangular cells computed in a D-dimensional space */
const numberOfCells = (i: number) =>
	Sum(1, Log2(r(i)), (j) => Exp2((D - i) * j));

// numberOfCells = Sum(1, Log2(r(i)), (i) => Exp2((D - i) * i))
// = (Exp2((D - i) ** (Log2(r(i)) + 1)) - 1) / (Exp2(D - i) - 1) - 1;
// = (Exp2(D - i) * r(i) ** (D - i) - 1) / (Exp2(D - i) - 1) - 1;
// = (Exp2(D - i) * (r(i) ** (D - i) - 1)) / (Exp2(D - i) - 1);

const _expectedCalculationsInner = (i: number) =>
	numberOfCells(i) *
	(predicate * pointsPerCell(D - i) + continuation + midpoint);

const expectedCalculations = () =>
	Sum(1, D, (i) => (numberOfCells(i) / 2) * _expectedCalculationsInner(i));
