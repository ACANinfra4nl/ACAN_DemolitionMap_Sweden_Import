"use client";
import { fetchBuildings } from "@/lib/fetchBuildings";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  Reducer,
  createContext,
  useEffect,
  useReducer,
} from "react";

const INITIAL_STATE: BuildingCollection & { loading: boolean } = {
  type: "FeatureCollection",
  features: [],
  loading: true,
};

export const enum ACTIONS {
  SET_BUILDINGS = "SET_BUILDINGS",
  ADD_BUILDING = "ADD_BUILDING",
}

interface SET_BUILDINGS_ACTION {
  type: ACTIONS.SET_BUILDINGS;
  payload: BuildingCollection;
}
interface ADD_BUILDING_ACTION {
  type: ACTIONS.ADD_BUILDING;
  payload: BuildingFeature;
}
type Action = SET_BUILDINGS_ACTION | ADD_BUILDING_ACTION;

const reducer: Reducer<typeof INITIAL_STATE, Action> = (
  state,
  { type, payload },
) => {
  switch (type) {
    case ACTIONS.SET_BUILDINGS:
      return { ...payload, loading: false };
    case ACTIONS.ADD_BUILDING:
      return {
        type: "FeatureCollection",
        features: [...state.features, payload],
        loading: false,
      };
  }
};

export const BuildingsContext =
  createContext<typeof INITIAL_STATE>(INITIAL_STATE); // ts-ignore-line
export const BuildingsDispatchContext = createContext<Dispatch<Action>>(
  () => null,
);

export const BuildingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  useEffect(() => {
    // load buildings once
    fetchBuildings().then((b) =>
      dispatch({
        type: ACTIONS.SET_BUILDINGS,
        payload: { type: "FeatureCollection", features: b },
      }),
    );
  }, []);
  return (
    <BuildingsContext.Provider value={state}>
      <BuildingsDispatchContext.Provider value={dispatch}>
        {children}
      </BuildingsDispatchContext.Provider>
    </BuildingsContext.Provider>
  );
};
