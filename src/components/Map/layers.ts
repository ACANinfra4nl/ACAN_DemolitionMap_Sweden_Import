import type { CircleLayer, SymbolLayer } from "react-map-gl/maplibre";
import type { ExpressionSpecification } from "maplibre-gl";

export const CLUSTERED_LAYER_STYLE: CircleLayer = {
  id: "cluster",
  source: "annotations",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#000",
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
  ["get", "status"],
  "räddad",
];
export const THREATENED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "status"],
  "hotad",
];
export const DEMOLISHED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "status"],
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
      "#FFB800",
      DEMOLISHED_EXPR,
      "#F00",
      "#41B82E",
    ],
    "circle-radius": 12,
    "circle-opacity": [
      "case",
      ["==", ["get", "reviewed"], true],
      1,
      0.45,
    ],
    "circle-stroke-width": [
      "case",
      ["==", ["get", "reviewed"], true],
      0,
      2,
    ],
    "circle-stroke-color": "#ffffff",
  },
};
