export enum Cell {
  DEAD = "DEAD",
  ALIVE = "ALIVE",
}

export type Pattern = {
  [row: number]: {
    [col: number]: Cell;
  };
};
