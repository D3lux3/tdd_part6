import { describe, expect, it } from "vitest";
import { parseHeader } from "../src/parser";

describe("Parser", () => {
  it("should parse pattern size from header", () => {
    const header = `x = 2, y = 2, rule = B3/S23`;

    const expected = {
      width: 2,
      height: 2,
    };

    const result = parseHeader(header);
    expect(result).toEqual(expected);
  });
});
