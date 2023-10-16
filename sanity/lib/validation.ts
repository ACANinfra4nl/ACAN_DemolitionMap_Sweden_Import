export const emailValidator = (value: string) =>
  !value || /.+\@.+\..+/.test(value) || "Please provide a valid email address";
