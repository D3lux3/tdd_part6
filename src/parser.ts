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
  const pattern: Pattern = {};
  const endOfPatternMarkIndex = line.indexOf("!");
  if (endOfPatternMarkIndex === -1) {
    throw new Error("Invalid pattern line format");
  }

  const patternLine = line.slice(0, endOfPatternMarkIndex);

  patternLine.split("$").forEach((row, index) => {
    const regex = /\s*(\d*)([o|b])\s*/g;
    const matches = line.matchAll(regex);

    const lineTags = [...matches]
      .map((match) => {
        const count = match[1] ? Number(match[1]) : 1;
        const cell = match[2] === "o" ? Cell.ALIVE : Cell.DEAD;
        return Array(count).fill(cell);
      })
      .forEach((cells, index) => {
        const row = 0;
        const col = index % cells.length;

        cells.forEach((cell, i) => {
          pattern[row] = pattern[row] || {};
          pattern[row][i] = cell;
        });
      });
  });

  return pattern;
};
