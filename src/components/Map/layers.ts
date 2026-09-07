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

export const OVERLAY_CLUSTERED_LAYER_STYLE: CircleLayer = {
  id: "overlay-cluster",
  source: "overlay-annotations",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#111111",
    "circle-radius": ["step", ["get", "point_count"], 14, 50, 18, 200, 24],
    "circle-opacity": 0.7,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

export const OVERLAY_CLUSTERED_COUNT_LAYER_STYLE: SymbolLayer = {
  id: "overlay-cluster-count",
  type: "symbol",
  source: "overlay-annotations",
  filter: ["has", "point_count"],
  paint: {
    "text-color": "#fff",
  },
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 12,
  },
};

export const OVERLAY_UNCLUSTERED_LAYER_STYLE: CircleLayer = {
  id: "overlay-unclustered-points",
  type: "circle",
  source: "overlay-annotations",
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
    "circle-radius": 7,
    "circle-opacity": 0.65,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

export const OVERLAY_COUNTRY_LABEL_STYLE: SymbolLayer = {
  id: "overlay-country-label",
  type: "symbol",
  source: "overlay-annotations",
  minzoom: 4,
  filter: ["!", ["has", "point_count"]],
  layout: {
    "text-field": ["get", "countryLabel"],
    "text-size": 10,
    "text-offset": [0, 1.35],
    "text-allow-overlap": false,
  },
  paint: {
    "text-color": "#111111",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1,
  },
};
