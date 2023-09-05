import { FC, HTMLAttributes } from "react";

export const CloseButton: FC<
  Pick<HTMLAttributes<HTMLButtonElement>, "onClick">
> = ({ onClick }) => (
  <button
    className="rounded-full w-8 h-8 leading-8 text-center bg-black text-white"
    onClick={onClick}
  >
    &times;
  </button>
);
