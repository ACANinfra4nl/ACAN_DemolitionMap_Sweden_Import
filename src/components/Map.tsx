import { FC, useCallback, useRef } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  CircleLayer,
  MapRef,
  SymbolLayer,
  Marker,
} from "react-map-gl/maplibre";
import { Feature, FeatureCollection, Point } from "geojson";
import type { FeatureBuilding, LatLng } from "@/types";

// Include style sheet
import "maplibre-gl/dist/maplibre-gl.css";

const DOUBLE_CLICK_TIMEOUT = 500;

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
    [isAdding, onAddMarker]
  );
  const clusteredLayerStyle: CircleLayer = {
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
  const clusterCountLayerStyle: SymbolLayer = {
    id: "cluster-count",
    type: "symbol",
    source: "annotations",
    filter: ["has", "point_count"],
    paint: {
      "text-color": "#fff",
    },
    layout: {
      "text-field": "{point_count_abbreviated}",
      //   "text-font": ["Queue Bold", "Arial Unicode MS Bold"],
      "text-size": 14,
    },
  };
  const unclusteredLayerStyle: CircleLayer = {
    id: "unclustered-points",
    type: "circle",
    source: "annotations",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#000000",
      "circle-radius": 10,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
      "circle-stroke-opacity": 0.7,
    },
  };

  return (
    <div className={className}>
      <ReactMapGl
        mapLib={import("maplibre-gl")}
        mapStyle="https://demotiles.maplibre.org/style.json"
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
          <Layer {...clusteredLayerStyle} />
          <Layer {...clusterCountLayerStyle} />
          <Layer {...unclusteredLayerStyle} />
        </Source>
        {addingLocation && (
          <Marker
            latitude={addingLocation.lat}
            longitude={addingLocation.lng}
          />
        )}
      </ReactMapGl>
    </div>
  );
};
