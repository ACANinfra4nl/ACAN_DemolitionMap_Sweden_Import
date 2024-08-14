import { RefObject, useEffect } from "react";

export const useClickOutside = <T extends Node>(
  element: RefObject<T>,
  onClick: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !document.body.contains(e.target as Node) || // NOTE: do not trigger click outside if the clicked element was removed from the DOM
        !element.current ||
        element.current.contains(e.target as Node)
      )
        return;
      onClick();
    };
    setTimeout(
      () => document.addEventListener("click", handleClickOutside),
      10,
    );
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
};
