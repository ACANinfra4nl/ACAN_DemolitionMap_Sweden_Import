import { FC, useEffect } from "react";

interface CloseButtonProps {
  onClick: () => void;
}

export const CloseButton: FC<CloseButtonProps> = ({ onClick }) => {
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
      aria-label="Stäng"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black p-2 text-2xl font-bold leading-none text-white"
    >
      &times;
    </button>
  );
};
