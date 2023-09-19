import { buildingToFeature, toFeature } from "@/lib/buildingToFeature";
import { FC, useCallback, useState } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  CircleLayer,
  MapRef,
  SymbolLayer,
  Marker,
  NavigationControl,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import {
  UNCLUSTERED_LAYER_STYLE,
  UNCLUSTERED_SYMBOL_LAYER_STYLE,
} from "./Map/layers";
import { FeatureCollection } from "geojson";

export const DetailsMap: FC<{ building: FeatureBuilding }> = ({ building }) => {
  const [viewState, setViewState] = useState({
    latitude: building.location.lat,
    longitude: building.location.lng,
    zoom: 17,
    pitch: 35,
  });
  const features: FeatureCollection = {
    type: "FeatureCollection",
    features: [toFeature(building)],
  };

  const handleInteraction = useCallback(
    (e: ViewStateChangeEvent) =>
      setViewState({
        ...e.viewState,
        latitude: building.location.lat,
        longitude: building.location.lng,
      }),
    [building],
  );

  return (
    <ReactMapGl
      mapLib={import("maplibre-gl")}
      mapStyle="https://api.maptiler.com/maps/abbe45d8-df15-4288-ab89-0a96d0eb6269/style.json?key=0VxOnlQWkxpRRW7vyr9t"
      {...viewState}
      onZoom={handleInteraction}
      onRotate={handleInteraction}
    >
      <Source id="annotations" type="geojson" data={features}>
        <Layer {...UNCLUSTERED_LAYER_STYLE} />
        <Layer {...UNCLUSTERED_SYMBOL_LAYER_STYLE} />
      </Source>
    </ReactMapGl>
  );
};
