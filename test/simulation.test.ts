import { describe, expect, it } from "vitest";

/**
 * 
Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

describe("Game of Life Simulation", () => {
  it("kills a live cell with fewer than two live neighbours (underpopulation) (3x3)", () => {
    const grid = {
      0: { 0: 0, 1: 0, 2: 0 },
      1: { 0: 0, 1: 1, 2: 0 },
      2: { 0: 0, 1: 0, 2: 0 },
    };

    const expected = {
      0: { 0: 0, 1: 0, 2: 0 },
      1: { 0: 0, 1: 0, 2: 0 },
      2: { 0: 0, 1: 0, 2: 0 },
    };
    const result = new Simulation(grid, 3, 3).nextGeneration();
    expect(result).toEqual(expected);
  });
});
