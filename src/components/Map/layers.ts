import type { CircleLayer, SymbolLayer } from "react-map-gl/maplibre";
import type { ExpressionSpecification } from "maplibre-gl";

export const CLUSTERED_LAYER_STYLE: CircleLayer = {
  id: "cluster",
  source: "annotations",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#000",
    "circle-stroke-width": 3,
    "circle-stroke-color": "#ccc",
    "circle-stroke-opacity": 0.3,
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  }, // Radius of each cluster when clustering points (defaults to 50)
};
export const CLUSTERED_COUNT_LAYER_STYLE: SymbolLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "annotations",
  filter: ["has", "point_count"],
  paint: {
    "text-color": "#fff",
  },
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 16,
  },
};
export const SAVED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "state"],
  "räddad",
];
export const THREATENED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "state"],
  "hotad",
];
export const DEMOLISHED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "state"],
  "riven",
];
export const UNCLUSTERED_LAYER_STYLE: CircleLayer = {
  id: "unclustered-points",
  type: "circle",
  source: "annotations",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": [
      "case",
      THREATENED_EXPR,
      "yellow",
      DEMOLISHED_EXPR,
      "red",
      "green",
    ],
    "circle-radius": 12,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
    "circle-stroke-opacity": 0.7,
  },
};

export const UNCLUSTERED_SYMBOL_LAYER_STYLE: SymbolLayer = {
  id: "uncluster-symbol",
  type: "symbol",
  source: "annotations",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "text-color": "#fff",
  },
  layout: {
    "text-field": "!",
    "text-size": 16,
    "text-font": ["helvetica neue bold"],
  },
};
