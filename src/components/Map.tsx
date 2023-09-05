import { FC, useCallback, useRef, useState } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  CircleLayer,
  MapRef,
  SymbolLayer,
  MapGeoJSONFeature,
  Marker,
} from "react-map-gl/maplibre";

// Include style sheet
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection } from "geojson";
import { clearSelection } from "@/lib/clearSelection";

const DOUBLE_CLICK_TIMEOUT = 500;

interface MapProps {
  features: FeatureCollection;
  isAdding: boolean;
  onAddMarker: (latLng: LatLng) => void;
  onClickFeature: (marker: MapGeoJSONFeature) => void;
  className?: string;
}

export const Map: FC<MapProps> = ({
  features,
  isAdding,
  onAddMarker,
  onClickFeature,
  className,
}) => {
  const [addingMarker, setAddingMarker] = useState<LatLng>();
  const mapRef = useRef<MapRef>(null);
  const handleClickMap: (e: MapLayerMouseEvent) => void = useCallback(
    (e) => {
      e.originalEvent.preventDefault();
      if (isAdding) {
        const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        setAddingMarker(coords);
        onAddMarker(coords);
      } else if (e.features?.length === 1) {
        // clicked an existing building, show info
        console.log("clicked feature", e.features);
        const feature = e.features[0];
        if (feature.properties.cluster === true) {
          // clicked cluster, zoom in
          mapRef.current?.flyTo({
            zoom: mapRef.current.getZoom() + 2,
            center: e.lngLat,
          });
        } else {
          // show info panel for feature
          onClickFeature(feature);
        }
      }
    },
    [onAddMarker]
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
        {isAdding && addingMarker && (
          <Marker latitude={addingMarker.lat} longitude={addingMarker.lng} />
        )}
      </ReactMapGl>
    </div>
  );
};
