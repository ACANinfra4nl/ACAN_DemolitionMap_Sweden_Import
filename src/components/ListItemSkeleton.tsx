import { FC } from "react";
import { StateIcon } from "./StateIcon";

export const ListItemSkeleton: FC = () => (
  <li>
    <div className="flex w-full flex-col gap-2">
      <div className="bg-gray-unknown aspect-square" />
      <div className="flex gap-2">
        <div className="flex flex-grow flex-col gap-1">
          <div className="bg-gray-unknown h-3 w-full"></div>
          <div className="bg-gray-unknown h-3 w-full"></div>
          <div className="bg-gray-unknown h-3 w-full"></div>
        </div>
        <StateIcon state="unknown" />
      </div>
    </div>
  </li>
);
