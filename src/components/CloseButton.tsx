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

  return null;
};
