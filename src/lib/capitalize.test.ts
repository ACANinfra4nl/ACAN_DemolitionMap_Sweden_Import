import { capitalize } from "./capitalize";

it("should capitalize first letter of string", () => {
  const text = "this is the string";
  const result = capitalize(text);
  expect(result).toBe("This is the string");
});
