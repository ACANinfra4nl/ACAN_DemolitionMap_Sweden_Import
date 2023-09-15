import { FC, useCallback, useRef } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  CircleLayer,
  MapRef,
  SymbolLayer,
  Marker,
  NavigationControl,
} from "react-map-gl/maplibre";
import { Feature, FeatureCollection, Point } from "geojson";

// Include style sheet
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import { ExpressionSpecification } from "maplibre-gl";
import classNames from "classnames";

const CLUSTERED_LAYER_STYLE: CircleLayer = {
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
const CLUSTERED_COUNT_LAYER_STYLE: SymbolLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "annotations",
  filter: ["has", "point_count"],
  paint: {
    "text-color": "#fff",
  },
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 14,
  },
};
const THREATENED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "state"],
  "hotad",
];
const DEMOLISHED_EXPR: ExpressionSpecification = [
  "==",
  ["get", "state"],
  "riven",
];
const UNCLUSTERED_LAYER_STYLE: CircleLayer = {
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
    "circle-radius": 10,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
    "circle-stroke-opacity": 0.7,
  },
};

interface MapProps {
  features: FeatureCollection;
  isAdding: boolean;
  addingLocation?: LatLng;
  onAddMarker: (latLng: LatLng) => void;
  onClickFeature: (id: string) => void;
  className?: string;
}

export const Map: FC<MapProps> = ({
  features,
  isAdding,
  addingLocation,
  onAddMarker,
  onClickFeature,
  className,
}) => {
  const mapRef = useRef<MapRef>(null);
  const handleClickMap: (e: MapLayerMouseEvent) => void = useCallback(
    (e) => {
      e.preventDefault();
      if (isAdding) {
        const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        onAddMarker(coords);
        mapRef.current?.flyTo({ center: coords });
      } else if (e.features?.length === 1) {
        // clicked an existing building, show info
        const feature = e.features[0];
        if (feature.properties.cluster === true) {
          // clicked cluster, zoom in
          mapRef.current?.flyTo({
            zoom: mapRef.current.getZoom() + 2,
            center: e.lngLat,
          });
        } else {
          // show info panel for feature
          onClickFeature(
            (feature as unknown as Feature<Point, FeatureBuilding>).properties
              ._id
          );
        }
      }
    },
    [isAdding, onAddMarker, onClickFeature]
  );

  return (
    <div className={classNames("text-red-600", className)}>
      <ReactMapGl
        mapLib={import("maplibre-gl")}
        mapStyle="https://api.maptiler.com/maps/abbe45d8-df15-4288-ab89-0a96d0eb6269/style.json?key=0VxOnlQWkxpRRW7vyr9t"
        initialViewState={{ latitude: 59.3293, longitude: 18.0686, zoom: 5 }}
        onClick={handleClickMap}
        ref={mapRef}
        interactiveLayerIds={["cluster", "unclustered-points"]}
      >
        <Source
          id="annotations"
          type="geojson"
          data={features}
          cluster
          clusterMaxZoom={11}
          clusterRadius={20}
        >
          <Layer {...CLUSTERED_LAYER_STYLE} />
          <Layer {...CLUSTERED_COUNT_LAYER_STYLE} />
          <Layer {...UNCLUSTERED_LAYER_STYLE} />
        </Source>
        {addingLocation && (
          <Marker
            latitude={addingLocation.lat}
            longitude={addingLocation.lng}
          />
        )}
        <NavigationControl
          showZoom
          visualizePitch={false}
          showCompass={false}
          position="bottom-right"
        />
      </ReactMapGl>
    </div>
  );
};
