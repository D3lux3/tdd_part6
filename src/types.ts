export enum Cell {
  DEAD = "b",
  ALIVE = "o",
}

export type Pattern = {
  [row: number]: {
    [col: number]: Cell;
  };
};
