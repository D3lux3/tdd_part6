import { createEmptyPatternGrid } from "./parser";
import { Cell, Pattern } from "./types";

class Simulation {
  grid: Pattern;
  rows: number;
  cols: number;

  constructor(grid: Pattern, rows: number, cols: number) {
    this.grid = grid;
    this.rows = rows;
    this.cols = cols;
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
  underPopulated(cell: Cell, neighbours: number): boolean {
    return cell === Cell.ALIVE && neighbours < 2;
  }
  nextGeneration(): Simulation {
    const newGrid: Pattern = createEmptyPatternGrid(this.rows, this.cols);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.getCell(row, col);
        const neighbours = this.neighboursCount(row, col);
        
        if (cell === Cell.ALIVE) {
          if (this.underPopulated(cell, neighbours)) {
            newGrid[row]![col]! = Cell.DEAD;
          } else if (neighbours > 3) {
            newGrid[row]![col]! = Cell.DEAD;
          } else {
            newGrid[row]![col]! = Cell.ALIVE;
          }
        } else {
          if (neighbours === 3) {
            newGrid[row]![col]! = Cell.ALIVE;
          } else {
            newGrid[row]![col]! = Cell.DEAD;
          }
        }
      }
    }

    return new Simulation(newGrid, this.rows, this.cols);
  }
}

export default Simulation;
