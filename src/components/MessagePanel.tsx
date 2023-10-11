import { FC, PropsWithChildren } from "react";
import { Button } from "./Button";

export const MessagePanel: FC<
  PropsWithChildren<{ title: string; onClose: () => void }>
> = ({ title, onClose, children }) => (
  <div className="flex flex-col justify-between">
    <div>
      <h2 className="mb-4 text-menu-s sm:text-menu">{title}</h2>
      {children}
    </div>
    <div>
      <Button onClick={onClose} className="w-full">
        Stäng
      </Button>
    </div>
  </div>
);
