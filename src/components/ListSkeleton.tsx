import { FC } from "react";
import { ListItemSkeleton } from "./ListItemSkeleton";

export const ListSkeleton: FC<{ items: number }> = ({ items }) => (
  <>
    {new Array(items).fill(null).map((_, i) => (
      <ListItemSkeleton key={i} />
    ))}
  </>
);
