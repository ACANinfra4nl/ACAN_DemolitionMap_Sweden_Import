import { stripLines } from "./stripLines";

it("should strip first line", () => {
  const text = `First line
Second line
Third line`;
  const result = stripLines(text, 1);
  expect(result).toBe(`Second line
Third line`);
});

it("should strip first 2 lines", () => {
  const text = `First line
Second line
Third line`;
  const result = stripLines(text, 2);
  expect(result).toBe("Third line");
});
