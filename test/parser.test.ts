import { describe, expect, it } from "vitest";
import { parseHeader, parsePatternLine } from "../src/parser";
import { Cell } from "../src/types";

describe("Parser", () => {
  it("should parse 1x1 pattern size from header", () => {
    const header = `x = 1, y = 1`;
    const expected = {
      width: 1,
      height: 1,
    };
    const result = parseHeader(header);
    expect(result).toEqual(expected);
  });

  it("should parse pattern size when x and y differs from header", () => {
    const header = `x = 2, y = 4, rule = B3/S23`;

    const expected = {
      width: 2,
      height: 4,
    };

    const result = parseHeader(header);
    expect(result).toEqual(expected);
  });

  it("should throw error if header if invalid", () => {
    expect(() => parseHeader("invalid header")).toThrowError("Invalid header format");
  });

  it("should parse 1x1 pattern ", () => {
    const patternLine = "1o!";
    const expected = {
      1: {
        1: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePatternLine(patternLine);
    expect(parsedPattern).toEqual(expected);
  });
});
