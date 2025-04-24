import { describe, expect, it } from "vitest";
import { parseHeader, parsePattern, createEmptyPatternGrid, loadRLEFile } from "../src/parser";
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
      0: {
        0: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 1, 1);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse 2x1 pattern", () => {
    const patternLine = "2o!";
    const expected = {
      0: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 2, 1);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse 1x2 pattern", () => {
    const patternLine = "o$o!";
    const expected = {
      0: {
        0: Cell.ALIVE,
      },
      1: {
        0: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 1, 2);
    expect(parsedPattern).toEqual(expected);
  });

  it("should throw error if pattern missing exclamation mark (end of pattern)", () => {
    const patternLine = "o$o";
    expect(() => parsePattern(patternLine, 1, 2)).toThrowError("Invalid pattern line format");
  });

  it("should parse block pattern", () => {
    const patternLine = "2o$2o!";
    const expected = {
      0: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
      },
      1: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 2, 2);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse blinker pattern", () => {
    const patternLine = "3o!";
    const expected = {
      0: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
        2: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 3, 1);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse glider pattern", () => {
    const patternLine = "bob$2bo$3o!";
    const expected = {
      0: {
        0: Cell.DEAD,
        1: Cell.ALIVE,
        2: Cell.DEAD,
      },
      1: {
        0: Cell.DEAD,
        1: Cell.DEAD,
        2: Cell.ALIVE,
      },
      2: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
        2: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 3, 3);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse optimized 1x1 pattern", () => {
    const patternLine = "!";
    const expected = {
      0: {
        0: Cell.DEAD,
      },
    };
    const parsedPattern = parsePattern(patternLine, 1, 1);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse optimized 2x1 pattern", () => {
    const patternLine = "!";
    const expected = {
      0: {
        0: Cell.DEAD,
        1: Cell.DEAD,
      },
    };
    const parsedPattern = parsePattern(patternLine, 2, 1);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse optimized glider pattern", () => {
    const patternLine = "bo$2bo$3o!";
    const expected = {
      0: {
        0: Cell.DEAD,
        1: Cell.ALIVE,
        2: Cell.DEAD,
      },
      1: {
        0: Cell.DEAD,
        1: Cell.DEAD,
        2: Cell.ALIVE,
      },
      2: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
        2: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 3, 3);
    expect(parsedPattern).toEqual(expected);
  });

  it("should generate 1x1 empty pattern space", () => {
    const expected = {
      0: {
        0: Cell.DEAD,
      },
    };

    expect(createEmptyPatternGrid(1, 1)).toEqual(expected);
  });

  it("should generate 2x2 empty pattern space", () => {
    const expected = {
      0: {
        0: Cell.DEAD,
        1: Cell.DEAD,
      },
      1: {
        0: Cell.DEAD,
        1: Cell.DEAD,
      },
    };

    expect(createEmptyPatternGrid(2, 2)).toEqual(expected);
  });

  it("should generate 1x2 empty pattern space", () => {
    const expected = {
      0: {
        0: Cell.DEAD,
      },
      1: {
        0: Cell.DEAD,
      },
    };

    expect(createEmptyPatternGrid(1, 2)).toEqual(expected);
  });

  it("should parse pattern with spaces", () => {
    const patternLine = "b  o   b  $ 2b o $ 3o   !";
    const expected = {
      0: {
        0: Cell.DEAD,
        1: Cell.ALIVE,
        2: Cell.DEAD,
      },
      1: {
        0: Cell.DEAD,
        1: Cell.DEAD,
        2: Cell.ALIVE,
      },
      2: {
        0: Cell.ALIVE,
        1: Cell.ALIVE,
        2: Cell.ALIVE,
      },
    };
    const parsedPattern = parsePattern(patternLine, 3, 3);
    expect(parsedPattern).toEqual(expected);
  });

  it("should parse header from block rle file", () => {
    const result = loadRLEFile("./patterns/block.rle");
    const expected = {
      width: 2,
      height: 2,
    };
    expect(result).toMatchObject(expected);
  });

  it("should parse lines before header from block rle file", () => {
    const result = loadRLEFile("./patterns/block.rle");
    const expected = {
      linesBeforeHeader: [
        "#N Block",
        "#C An extremely common 4-cell still life.",
        "#C www.conwaylife.com/wiki/index.php?title=Block",
      ],
    };
    expect(result).toMatchObject(expected);
  });

  it("should return error if file not found", () => {
    expect(() => loadRLEFile("./patterns/invalid2.rle")).toThrowErrorMatchingSnapshot();
  });

  it("should return error if header not found", () => {
    expect(() => loadRLEFile("./patterns/invalid.rle")).toThrowErrorMatchingSnapshot();
  });

  it("should return error if line exceeds 70 characters", () => {
    expect(() => loadRLEFile("./patterns/too_long_lines.rle")).toThrowErrorMatchingSnapshot();
  });

  it("should parse header without lines preceding it from block rle file", () => {
    const result = loadRLEFile("./patterns/block_no_lines_before_header.rle");
    const expected = {
      linesBeforeHeader: [],
      width: 2,
      height: 2,
    };
    expect(result).toMatchObject(expected);
  });

  it("should parse a rle file with pattern splitted on two lines", () => {
    const result = loadRLEFile("./patterns/splitted_block.rle");
    const expected = {
      linesBeforeHeader: ["#N Splitted Block"],
      width: 2,
      height: 2,
      pattern: {
        0: {
          0: Cell.ALIVE,
          1: Cell.ALIVE,
        },
        1: {
          0: Cell.ALIVE,
          1: Cell.ALIVE,
        },
      },
    };
    expect(result).toMatchObject(expected);
  });

  it("should parse a rle file with otherwise too long pattern, but its splitted on two lines", () => {
    const result = loadRLEFile("./patterns/too_long_lines_splitted.rle");
    const expected = {
      linesBeforeHeader: ["#N Long and splitted"],
      width: 80,
      height: 80,
    };
    expect(result).toMatchObject(expected);
  });

  it("should parse glider with a lots of whitespace in the pattern", () => {
    const result = loadRLEFile("./patterns/glider_with_whitespace.rle");
    const expected = {
      width: 3,
      height: 3,
      pattern: {
        0: {
          0: Cell.DEAD,
          1: Cell.ALIVE,
          2: Cell.DEAD,
        },
        1: {
          0: Cell.DEAD,
          1: Cell.DEAD,
          2: Cell.ALIVE,
        },
        2: {
          0: Cell.ALIVE,
          1: Cell.ALIVE,
          2: Cell.ALIVE,
        },
      },
    };
    expect(result).toMatchObject(expected);
  });
});
