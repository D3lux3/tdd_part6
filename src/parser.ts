import Simulation from "./Simulation";
import { Cell, LoadRLEResult, Pattern } from "./types";
import fs from "fs";

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

export const parsePattern = (line: string, width: number, height: number): Pattern => {
  const endOfPatternMarkIndex = line.indexOf("!");
  if (endOfPatternMarkIndex === -1) {
    throw new Error("Invalid pattern line format");
  }

  const patternLine = line.slice(0, endOfPatternMarkIndex);

  const emptyGrid = createEmptyPatternGrid(width, height);
  const parsed = patternLine.split("$").reduce((acc, row, rowIndex) => {
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

  const union: Pattern = { ...emptyGrid, ...parsed };
  const deepUnion = Object.keys(union).reduce((acc: Record<number, Record<number, Cell>>, _, rowIndex) => {
    const row = union[rowIndex];
    const newRowUnion = { ...emptyGrid[rowIndex], ...row };
    acc[rowIndex] = newRowUnion;
    return acc;
  }, {});

  return deepUnion;
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

export const loadRLEFile = (filePath: string): LoadRLEResult => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.split(/\r?\n/);
    const linesBeforeHeader = lines.filter((line) => line.startsWith("#"));

    const headerLine = lines[linesBeforeHeader.length];
    const header = parseHeader(headerLine || "");
    const linesAfterHeader = lines.slice(linesBeforeHeader.length + 1);

    if (linesAfterHeader.filter((line) => line.length > 70).length > 0) {
      throw new Error("Line exceeds 70 characters");
    }

    const pattern = parsePattern(linesAfterHeader.join(""), header.width, header.height);

    const linesAfterPattern = linesAfterHeader.slice(linesAfterHeader.findIndex((line) => line.includes("!")) + 1);
    return {
      linesBeforeHeader,
      ...header,
      pattern,
      linesAfterPattern,
    };
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
};


export const outputSimulatedPattern = (simulated: Simulation, linesBeforeHeader: string[], linesAfterPattern: string[]) => {
  const linesBeforeHeaderString = linesBeforeHeader.join("\n");
  const {x, y} = simulated.getPatternShape();
  const header = `x = ${x}, y = ${y}`;
  const pattern = simulated.toString();
  const linesAfterPatternString = linesAfterPattern.join("\n");
  const output = `${linesBeforeHeaderString}\n${header}\n${pattern}\n${linesAfterPatternString}`;
  return output;
}