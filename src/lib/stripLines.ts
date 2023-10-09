export const stripLines = (str: string, lines: number) =>
  str.replace(new RegExp(`^(.*\r?\n){${lines}}`, "m"), "");
