import path from "path";
import { it, describe, expect } from "vitest";
import { execa } from "execa";

describe("End-to-end test", () => {
  it("should read and parse given file", async () => {
    const indexPath = path.resolve(__dirname, "..", "src", "index.ts");
    const filePath = path.resolve(__dirname, "..", "patterns", "block.rle");

    const { stdout } = await execa("ts-node", [indexPath, filePath, "123"]);

    const expected = `
#N Block
#C An extremely common 4-cell still life.
#C www.conwaylife.com/wiki/index.php?title=Block
x = 2, y = 2, rule = B3/S23
2o$2o!
`;
    expect(stdout).toContain(expected);
  });
});
