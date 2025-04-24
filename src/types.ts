export enum Cell {
  DEAD = "b",
  ALIVE = "o",
}

export type Pattern = {
  [row: number]: {
    [col: number]: Cell;
  };
};

export type LoadRLEResult = {
  linesBeforeHeader: string[];
  width: number;
  height: number;
  pattern: Pattern;
  linesAfterPattern: string[];
};
