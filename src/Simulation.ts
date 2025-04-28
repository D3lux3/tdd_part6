import { Cell, Pattern } from "./types";

class Simulation {
  grid: Pattern;

  constructor(grid: Pattern) {
    this.grid = grid;
  }

  private getCell(row: number, col: number) {
    if (this.grid[row] && this.grid[row][col]) {
      return this.grid[row][col];
    }
    return Cell.DEAD;
  }

  neighboursCount(row: number, col: number): number {
    const neighbours: [number, number][] = [
      [row - 1, col], // up
      [row + 1, col], // down
      [row, col - 1], // left
      [row, col + 1], // right
      [row - 1, col - 1], // up-left
      [row - 1, col + 1], // up-right
      [row + 1, col - 1], // down-left
      [row + 1, col + 1], // down-right
    ];
    return neighbours.reduce((count, coords: [number, number]) => {
      const [x, y] = coords;
      if (this.getCell(x, y) === Cell.ALIVE) {
        count++;
      }
      return count;
    }, 0);
  }

  computeNextCellState(x: number, y: number): Cell {
    const cell = this.getCell(x, y);
    const neighbours = this.neighboursCount(x, y);
    if (cell === Cell.ALIVE) {
      if (neighbours < 2) {
        return Cell.DEAD;
      }
      if (neighbours > 3) {
        return Cell.DEAD;
      }
      return Cell.ALIVE;
    }

    if (neighbours === 3) {
      return Cell.ALIVE;
    }
    return Cell.DEAD;
  }

  nextGeneration(): Simulation {
    const newGrid: Pattern = {};
    const boundingBox = this.getBoundingBox(this.grid);

    const rows = boundingBox.bottom - boundingBox.top + 1;
    const cols = boundingBox.right - boundingBox.left + 1;
    const maxDimension = Math.max(rows, cols);

    for (let row = -1; row < maxDimension + 1; row++) {
      for (let col = -1; col < maxDimension + 1; col++) {
        const newCellState = this.computeNextCellState(row, col);
        if (!newGrid[row]) {
          newGrid[row] = {};
        }
        newGrid[row]![col] = newCellState;
      }
    }
    const extractedShape = this.extractShape(newGrid);
    return new Simulation(extractedShape);
  }

  private extractShape(grid: Pattern) {
    const { top, bottom, left, right } = this.getBoundingBox(grid);
    const extractedShape: Pattern = {};

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        const cell = grid[row]?.[col] ?? Cell.DEAD;

        if (!extractedShape[row - top]) {
          extractedShape[row - top] = {};
        }
        extractedShape[row - top]![col - left] = cell;
      }
    }
    return extractedShape;
  }

  getBoundingBox(grid: Pattern) {
    const aliveCells = Object.entries(grid).reduce((acc: [number, number][], [rowIndex, row]) => {
      Object.entries(row).forEach(([colIndex, cell]) => {
        if (cell === Cell.ALIVE) {
          acc.push([Number(rowIndex), Number(colIndex)]);
        }
      });
      return acc;
    }, []);

    const rows = aliveCells.map(([x]) => x);
    const cols = aliveCells.map(([, y]) => y);

    return {
      top: Math.min(...rows),
      bottom: Math.max(...rows),
      left: Math.min(...cols),
      right: Math.max(...cols),
    };
  }

  getPatternShape() {
    const boundingBox = this.getBoundingBox(this.grid);
    const rows = boundingBox.bottom - boundingBox.top + 1;
    const cols = boundingBox.right - boundingBox.left + 1;
    return { rows, cols };
  }

  toString(): string {
    return `${Object.entries(this.grid)
      .map(([_rowIndex, row]) => {
        return Object.entries(row)
          .map(([_colIndex, cell]) => (cell === Cell.ALIVE ? "o" : "b"))
          .join("");
      })
      .join("$")}!`;
  }
}

export default Simulation;
