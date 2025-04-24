import { Cell, Pattern } from "./types";

class Simulation {
  grid: Pattern;
  rows: number;
  cols: number;

  constructor(grid: Pattern, y: number, x: number) {
    this.grid = grid;
    this.rows = y;
    this.cols = x;
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
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const newCellState = this.computeNextCellState(row, col);
        if (!newGrid[row]) {
          newGrid[row] = {};
        }
        newGrid[row]![col] = newCellState;
      }
    }
    const { x, y } = this.getGridShape(newGrid);
    return new Simulation(newGrid, x, y);
  }

  private getGridShape(grid: Pattern): { x: number; y: number } {
    const aliveCells = Object.entries(grid).reduce((acc: [number, number][], [rowIndex, row]) => {
      Object.entries(row).forEach(([colIndex, cell]) => {
        if (cell === Cell.ALIVE) {
          acc.push([Number(rowIndex), Number(colIndex)]);
        }
      });
      return acc;
    }, []);

    const minX = Math.min(...aliveCells.map(([x]) => x));
    const maxX = Math.max(...aliveCells.map(([x]) => x));
    const minY = Math.min(...aliveCells.map(([, y]) => y));
    const maxY = Math.max(...aliveCells.map(([, y]) => y));

    if (aliveCells.length === 0) {
      return { x: 0, y: 0 };
    }
    return { y: maxX - minX + 1, x: maxY - minY + 1 };
  }

  getPatternShape(): { x: number; y: number } {
    return this.getGridShape(this.grid);
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
