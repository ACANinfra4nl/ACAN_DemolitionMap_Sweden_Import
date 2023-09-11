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
      className="rounded-full w-8 h-8 leading-8 text-center bg-black text-white"
      onClick={onClick}
    >
      &times;
    </button>
  );
};
