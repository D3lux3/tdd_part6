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

  it("should optimize the pattern glider correctly", () => {
    const glider = {
      0: { 0: Cell.DEAD, 1: Cell.ALIVE, 2: Cell.DEAD },
      1: { 0: Cell.DEAD, 1: Cell.DEAD, 2: Cell.ALIVE },
      2: { 0: Cell.ALIVE, 1: Cell.ALIVE, 2: Cell.ALIVE },
    };
    const sim = new Simulation(glider);
    const expectedShapeString = `bob$2bo$3o!`;
    const result = sim.toString();
    expect(result).toEqual(expectedShapeString);
  });

  it("should split the pattern two multiple lines if pattern exceeds 70 character", () => {
    const bigPattern = {
      0: {
        0: Cell.DEAD,
        1: Cell.ALIVE,
        2: Cell.DEAD,
        3: Cell.ALIVE,
        4: Cell.DEAD,
        5: Cell.ALIVE,
        6: Cell.DEAD,
        7: Cell.ALIVE,
        8: Cell.DEAD,
        9: Cell.ALIVE,
        10: Cell.DEAD,
        11: Cell.ALIVE,
        12: Cell.DEAD,
        13: Cell.ALIVE,
        14: Cell.DEAD,
        15: Cell.ALIVE,
        16: Cell.DEAD,
        17: Cell.ALIVE,
        18: Cell.DEAD,
        19: Cell.ALIVE,
        20: Cell.DEAD,
        21: Cell.ALIVE,
        22: Cell.DEAD,
        23: Cell.ALIVE,
        24: Cell.DEAD,
        25: Cell.ALIVE,
        26: Cell.DEAD,
        27: Cell.ALIVE,
        28: Cell.DEAD,
        29: Cell.ALIVE,
        30: Cell.DEAD,
        31: Cell.ALIVE,
        32: Cell.DEAD,
        33: Cell.ALIVE,
        34: Cell.DEAD,
        35: Cell.ALIVE,
        36: Cell.DEAD,
        37: Cell.ALIVE,
        38: Cell.DEAD,
        39: Cell.ALIVE,
        40: Cell.DEAD,
        41: Cell.ALIVE,
        42: Cell.DEAD,
        43: Cell.ALIVE,
        44: Cell.DEAD,
        45: Cell.ALIVE,
        46: Cell.DEAD,
        47: Cell.ALIVE,
        48: Cell.DEAD,
        49: Cell.ALIVE,
        50: Cell.DEAD,
        51: Cell.ALIVE,
        52: Cell.DEAD,
        53: Cell.ALIVE,
        54: Cell.DEAD,
        55: Cell.ALIVE,
        56: Cell.DEAD,
        57: Cell.ALIVE,
        58: Cell.DEAD,
        59: Cell.ALIVE,
        60: Cell.DEAD,
        61: Cell.ALIVE,
        62: Cell.DEAD,
        63: Cell.ALIVE,
        64: Cell.DEAD,
        65: Cell.ALIVE,
        66: Cell.DEAD,
        67: Cell.ALIVE,
        68: Cell.DEAD,
        69: Cell.ALIVE,
        70: Cell.DEAD,
        71: Cell.ALIVE,
        72: Cell.DEAD,
        73: Cell.ALIVE,
        74: Cell.DEAD
      }
    }
    
    const sim = new Simulation(bigPattern);
    const expectedShapeString = `obobobobobobobobobobobobobobobobobobobobobobobobobobobobobobobobobobo$bobo!`;
    const result = sim.toString();
    expect(result).toEqual(expectedShapeString);
  });
});
