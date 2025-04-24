import { Cell } from "./types";

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

export const parsePatternLine = (line: string) => {
  return { 1: { 1: Cell.ALIVE } };
};
