import { describe, expect, it } from "vitest";
import Simulation from "../src/Simulation";
import { Cell } from "../src/types";

/**
 * 
[x] Any live cell with fewer than two live neighbours dies, as if by underpopulation.
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

    const result = new Simulation(grid).neighboursCount(1, 1);
    expect(result).toEqual(0);
  });

  it("kills a live cell with fewer than two live neighbours (underpopulation)", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
      2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
    };

    const expectedSimulation = new Simulation({});

    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("should keep a live cell with two live neighbours", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
    };

    const expectedGridState = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE },
    };

    const expectedSimulation = new Simulation(expectedGridState);

    expect(expectedSimulation.computeNextCellState(1, 1)).toEqual(Cell.ALIVE);
    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("should keep a live cell with three live neighbours", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
    };

    const expectedGridState = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE },
    };
    const expectedSimulation = new Simulation(expectedGridState);

    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("kills a live cell with more than three live neighbours (overpopulation)", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      2: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
    };

    const expectedGridState = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.DEAD, 2: Cell.DEAD },
      2: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
    };
    const expectedSimulation = new Simulation(expectedGridState);
    expect(expectedSimulation.computeNextCellState(1, 1)).toEqual(Cell.DEAD);
    expect(expectedSimulation.computeNextCellState(1, 2)).toEqual(Cell.DEAD);
    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("should revive a dead cell with exactly three live neighbours", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      2: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
    };

    const expectedGridState = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.DEAD, 2: Cell.DEAD },
      2: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
    };
    const expectedSimulation = new Simulation(expectedGridState);

    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("should simulate block pattern properly", () => {
    const grid = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE },
    };

    const expectedGridState = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE },
    };
    const expectedSimulation = new Simulation(expectedGridState);

    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("should simulate blinker pattern properly", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE, 2: Cell.ALIVE },
      2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
    };

    const expectedGridState = {
      0: { 0: Cell.ALIVE },
      1: { 0: Cell.ALIVE },
      2: { 0: Cell.ALIVE },
    };
    const expectedSimulation = new Simulation(expectedGridState);
    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(expectedSimulation);
  });

  it("should return 1x1 bounding box for a single cell", () => {
    const grid = {
      0: { 0: Cell.ALIVE },
    };

    const simulation = new Simulation(grid);
    const boundingBox = simulation.getBoundingBox(grid);
    expect(boundingBox).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });

  it("should return 2x2 bounding box for a block", () => {
    const blockGrid = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE },
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE },
    };

    const simulation = new Simulation(blockGrid);
    const boundingBox = simulation.getBoundingBox(blockGrid);
    expect(boundingBox).toEqual({ top: 0, bottom: 1, left: 0, right: 1 });
  });

  it("should return 2x1 bounding box", () => {
    const grid = {
      0: { 0: Cell.ALIVE },
      1: { 0: Cell.ALIVE },
    };

    const simulation = new Simulation(grid);
    const boundingBox = simulation.getBoundingBox(grid);
    expect(boundingBox).toEqual({ top: 0, bottom: 1, left: 0, right: 0 });
  });

  it("should return 1x2 bounding box", () => {
    const grid = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE },
      1: { 0: Cell.DEAD, 1: Cell.DEAD },
    };

    const simulation = new Simulation(grid);
    const boundingBox = simulation.getBoundingBox(grid);
    expect(boundingBox).toEqual({ top: 0, bottom: 0, left: 0, right: 1 });
  });

  it("should output the correct blinker pattern after 1 generation", () => {
    const grid = {
      1: { 0: Cell.ALIVE, 1: Cell.ALIVE, 2: Cell.ALIVE },
    };
    const expectedGridState = {
      0: { 0: Cell.ALIVE },
      1: { 0: Cell.ALIVE },
      2: { 0: Cell.ALIVE },
    };

    const result = new Simulation(grid).nextGeneration();
    expect(result).toEqual(new Simulation(expectedGridState));
  });


  it("should optimize the pattern output correctly 2x1", () => {
    const grid = {
      0: { 0: Cell.ALIVE, 1: Cell.ALIVE, 2: Cell.DEAD },
    };

    const sim = new Simulation(grid);
    const expectedShapeString = `2o!`;
    const result = sim.toString();
    expect(result).toEqual(expectedShapeString);
  });

  it("should optimize the pattern output correctly 3x3", () => {
    const grid = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      1: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.ALIVE },
      2: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.DEAD },
    };

    const sim = new Simulation(grid);
    const expectedShapeString = `2o$2o!`;
    const result = sim.toString();
    expect(result).toEqual(expectedShapeString);
  });
});
