import { describe, it, expect } from "bun:test";
import {
	type Midpoint,
	ndBinarySearch,
	type ShouldContinue,
} from "../src/nd.js";

describe("ndBinarySearch", () => {
	it("should find the correct border", () => {
		const r = 4;
		type Vec = [number, number, number];
		const alwaysEnd: Vec = [0, 0, 0];
		const neverEnd: Vec = [r * 4, r * 2, r * 3];
		const predicate = (vector: Vec) =>
			vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2 < r ** 2; // Sphere equation
		const mid = (always: number, never: number) =>
			Math.floor((always + never) / 2);
		const midpoint: Midpoint<Vec> = [mid, mid, mid];
		const c = (always: number, never: number) => never - always > 1;
		const shouldContinue: ShouldContinue<Vec> = [c, c, c];

		const result = [
			...ndBinarySearch(
				alwaysEnd,
				neverEnd,
				predicate,
				midpoint,
				shouldContinue,
			),
		];

		expect(result).toHaveLength(34);
		expect(
			[...result].sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]),
		).toStrictEqual([
			[0, 0, 3],
			[0, 1, 3],
			[0, 2, 2],
			[0, 2, 3],
			[0, 3, 0],
			[0, 3, 1],
			[0, 3, 2],
			[1, 0, 3],
			[1, 1, 2],
			[1, 1, 3],
			[1, 2, 1],
			[1, 2, 2],
			[1, 2, 3],
			[1, 3, 0],
			[1, 3, 1],
			[1, 3, 2],
			[2, 0, 2],
			[2, 0, 3],
			[2, 1, 1],
			[2, 1, 2],
			[2, 1, 3],
			[2, 2, 0],
			[2, 2, 1],
			[2, 2, 2],
			[2, 3, 0],
			[2, 3, 1],
			[3, 0, 0],
			[3, 0, 1],
			[3, 0, 2],
			[3, 1, 0],
			[3, 1, 1],
			[3, 1, 2],
			[3, 2, 0],
			[3, 2, 1],
		]);

		const set = new Set<string>();
		result.forEach((vector) => {
			// Ensure the point is on the border
			expect(
				vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2,
				vector.toString(),
			).toBeLessThan(r ** 2);
			expect(
				(vector[0] + 1) ** 2 + (vector[1] + 1) ** 2 + (vector[2] + 1) ** 2,
				vector.toString(),
			).toBeGreaterThanOrEqual(r ** 2);

			// Ensure uniqueness
			expect(set.has(vector.toString()), vector.toString()).toBe(false);
			set.add(vector.toString());

			// Ensure neighboring
			const neighbors = result.filter(
				(v) =>
					Math.abs(v[0] - vector[0]) +
						Math.abs(v[1] - vector[1]) +
						Math.abs(v[2] - vector[2]) ===
					1,
			);
			expect(neighbors).not.toHaveLength(0);
		});
	});

	it("throws when input lengths mismatch (coverage for length check)", () => {
		const mid = (a: number, b: number) => Math.floor((a + b) / 2);
		const c = (a: number, b: number) => b - a > 1;

		// Case 1: alwaysEnd and neverEnd length mismatch
		expect(() =>
			ndBinarySearch<[number, number]>(
				// biome-ignore lint/suspicious/noExplicitAny: testing length check
				[0, 0, 0] as any,
				[1, 1],
				() => true,
				[mid, mid],
				[c, c],
			),
		).toThrow("All input vectors must have the same length");

		// Case 2: midpoint length mismatch
		expect(() =>
			ndBinarySearch<[number, number]>(
				[0, 0],
				[2, 2],
				(v) => v[0] + v[1] <= 1,
				// biome-ignore lint/suspicious/noExplicitAny: testing length check
				[mid] as any,
				[c, c],
			),
		).toThrow("All input vectors must have the same length");

		// Case 3: shouldContinue length mismatch
		expect(() =>
			ndBinarySearch<[number, number]>(
				[0, 0],
				[2, 2],
				(v) => v[0] + v[1] <= 1,
				[mid, mid],
				// biome-ignore lint/suspicious/noExplicitAny: testing length check
				[c] as any,
			),
		).toThrow("All input vectors must have the same length");
	});
});
