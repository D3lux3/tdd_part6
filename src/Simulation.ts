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
}

export default Simulation;
