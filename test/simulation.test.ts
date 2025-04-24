import { describe, expect, it } from "vitest";
import Simulation from "../src/Simulation";
import { Cell } from "../src/types";

/**
 * 
Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

describe("Game of Life Simulation", () => {

    it("should return neighbours count for alone cell", () => {
        const grid = {
            0: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
            1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
            2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
          };

        const result = new Simulation(grid, 3, 3).neighboursCount(1, 1);
        expect(result).toEqual(0);
    });

  it.skip("kills a live cell with fewer than two live neighbours (underpopulation) (3x3)", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
      2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
    };

    const expected = {
      0: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
      1: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
      2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
    };

    const result = new Simulation(grid, 3, 3).nextGeneration();
    expect(result).toEqual(expected);
  });
});
