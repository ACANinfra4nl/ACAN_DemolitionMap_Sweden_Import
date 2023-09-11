export const capitalize = (str: string) =>
  str.substring(0, 1).toLocaleUpperCase() +
  str.substring(1).toLocaleLowerCase();
