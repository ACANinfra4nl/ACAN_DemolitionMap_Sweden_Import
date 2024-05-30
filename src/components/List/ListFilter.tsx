import {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
} from "react";
import { FilterButton } from "../FilterButton";
import { SortButton } from "./SortButton";
import { SORTERS } from "./sorting";

interface Props {
  stateFilter?: string;
  setStateFilter: (state?: string) => void;
  dict: Dictionary;
  sortDesc: boolean;
  setSortDesc: Dispatch<SetStateAction<boolean>>;
  sortBy: keyof typeof SORTERS;
  setSortBy: (value: keyof typeof SORTERS) => void;
  setFilter: (value: string) => void;
}

export const ListFilter: FC<Props> = ({
  stateFilter,
  setStateFilter,
  sortBy,
  sortDesc,
  setSortBy,
  setSortDesc,
  setFilter,
  dict,
}) => {
  const handleSortBy = (key: keyof typeof SORTERS) => () => {
    if (sortBy === key) setSortDesc((old) => !old);
    else setSortDesc(false);
    setSortBy(key);
  };

  const handleFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setFilter(value.trim());
    },
    [],
  );

  return (
    <div className="acan-text-menu sticky top-0 z-10 grid w-full grid-cols-[auto_1fr_auto] gap-x-10 gap-y-3 px-5">
      <div className="col-span-3 flex gap-2 md:col-span-1">
        <FilterButton
          state={dict.states.demolished}
          filter={stateFilter}
          onClick={setStateFilter}
          dictStates={dict.states}
        />
        <FilterButton
          state={dict.states.threatened}
          filter={stateFilter}
          onClick={setStateFilter}
          dictStates={dict.states}
        />
        <FilterButton
          state={dict.states.saved}
          filter={stateFilter}
          onClick={setStateFilter}
          dictStates={dict.states}
        />
      </div>
      <div className="relative col-span-3 items-center xs:col-span-2 md:col-span-1 md:col-start-2">
        <input
          aria-label={dict.ariaLabels.filter}
          id="filter"
          type="text"
          name="filter"
          className="peer w-full border-b border-current bg-transparent pl-6 uppercase outline-none placeholder:uppercase placeholder:text-current focus:border-b-acan-blue"
          onChange={handleFilterChange}
          placeholder={dict.search}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          strokeWidth={2}
          className="absolute bottom-1 left-0 stroke-black peer-focus:stroke-acan-blue"
        >
          <circle cx="6.5" cy="6.5" r="5.5" />
          <path d="m10 10 5 5" />
        </svg>
      </div>
      <div className="col-span-3 flex items-center justify-end gap-2 xs:col-span-1 xs:col-start-3">
        <SortButton
          sortKey="_createdAt"
          sortBy={sortBy}
          sortDesc={sortDesc}
          onClick={handleSortBy("_createdAt")}
        >
          {dict.sort.added}
        </SortButton>
        <SortButton
          sortKey="buildYear"
          sortBy={sortBy}
          sortDesc={sortDesc}
          onClick={handleSortBy("buildYear")}
        >
          {dict.sort.buildYear}
        </SortButton>
        <SortButton
          sortKey="demolitionYear"
          sortBy={sortBy}
          sortDesc={sortDesc}
          onClick={handleSortBy("demolitionYear")}
        >
          {dict.sort.demolitionYear}
        </SortButton>
      </div>
    </div>
  );
};
