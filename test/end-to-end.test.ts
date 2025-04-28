import path from "path";
import { it, describe, expect } from "vitest";
import { execa } from "execa";
import '../src/index.ts?raw';

describe("End-to-end test", () => {
  it("should read, parse and simulate shape from given file", async () => {
    const indexPath = path.resolve(__dirname, "..", "src", "index.ts");
    const filePath = path.resolve(__dirname, "..", "patterns", "blinker.rle");

    const { stdout } = await execa("ts-node", [indexPath, filePath, "2"]);

    const expected = `#N Blinker
#O John Conway
#C A period 2 oscillator that is the smallest and most common oscillator.
#C www.conwaylife.com/wiki/index.php?title=Blinker
x = 3, y = 1
ooo!`
    expect(stdout).toEqual(expected);
    expect(stdout).toContain("N Blinker");
  });
});
