import { Cell, Pattern } from "./types";

export const parseHeader = (header: string) => {
  const regex = /x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)/;
  const match = header.match(regex);
  if (!match) {
    throw new Error("Invalid header format");
  }
  const width = Number(match[1]);
  const height = Number(match[2]);

  return { width, height };
};

export const parsePatternLine = (line: string): Pattern => {
  const endOfPatternMarkIndex = line.indexOf("!");
  if (endOfPatternMarkIndex === -1) {
    throw new Error("Invalid pattern line format");
  }

  const patternLine = line.slice(0, endOfPatternMarkIndex);

  return patternLine.split("$").reduce((acc, row, rowIndex) => {
    const regex = /\s*(\d*)([o|b])\s*/g;
    const matches = row.matchAll(regex);

    const lineTags = [...matches]
      .map((match) => {
        const count = match[1] ? Number(match[1]) : 1;
        const cell = match[2] === "o" ? Cell.ALIVE : Cell.DEAD;
        return Array(count).fill(cell);
      })
      .flat() as Cell[];

    if (lineTags.length === 0) {
      return { 0: { 0: Cell.DEAD } };
    }

    const rowTags = lineTags.reduce((acc: Record<number, Record<number, Cell>>, cell, index) => {
      if (!acc[rowIndex]) {
        acc[rowIndex] = {};
      }
      acc[rowIndex][index] = cell;
      return acc;
    }, {});

    return { ...acc, ...rowTags };
  }, {});
};

export const createEmptyPatternGrid = (width: number, height: number): Pattern => {
  const pattern: Pattern = [...Array(height).keys()].reduce((rowAcc: Pattern, rowIndex) => {
    const row: Record<number, Cell> = [...Array(width).keys()].reduce((cellAcc: Record<number, Cell>, cellIndex) => {
      cellAcc[cellIndex] = Cell.DEAD;
      return cellAcc;
    }, {});
    return { ...rowAcc, [rowIndex]: row };
  }, {});
  return pattern;
};
