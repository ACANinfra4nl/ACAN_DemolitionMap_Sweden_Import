import { FC, useEffect } from "react";

interface CloseButtonProps {
  onClick: () => void;
  close: string;
}

export const CloseButton: FC<CloseButtonProps> = ({ onClick, close }) => {
  useEffect(() => {
    // handle escape = close
    if (!onClick) return;
    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClick();
    };
    document.addEventListener("keyup", handleKeypress);
    return () => document.removeEventListener("keyup", handleKeypress);
  }, [onClick]);

  return (
    <button
      aria-label={close}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center text-5xl font-bold leading-none text-white hover:text-acan-blue"
    >
      &times;
    </button>
  );
};
