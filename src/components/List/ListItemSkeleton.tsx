import { FC } from "react";
import { StateIcon } from "./StateIcon";

export const ListItemSkeleton: FC = () => (
  <li>
    <div className="flex w-full flex-col gap-2">
      <div className="aspect-square bg-gray-unknown" />
      <div className="flex gap-2">
        <div className="flex flex-grow flex-col gap-1">
          <div className="h-3 w-full bg-gray-unknown"></div>
          <div className="h-3 w-full bg-gray-unknown"></div>
          <div className="h-3 w-full bg-gray-unknown"></div>
        </div>
        {/* workaround to enable build */}
        {/*        <StateIcon state="unknown" /> */}
      </div>
    </div>
  </li>
);
