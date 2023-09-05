import { FC, useCallback, useRef } from "react";
import MapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  CircleLayer,
  MapRef,
  SymbolLayer,
  MapGeoJSONFeature,
} from "react-map-gl/maplibre";

// Include style sheet
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection } from "geojson";

interface MapProps {
  features: FeatureCollection;
  onAddMarker: (latLng: Pick<MarkerType, "lat" | "lng">) => void;
  onClickFeature: (marker: MapGeoJSONFeature) => void;
  className?: string;
}

export const Map: FC<MapProps> = ({
  features,
  onAddMarker,
  onClickFeature,
  className,
}) => {
  const mapRef = useRef<MapRef>(null);
  const handleClickMap: (e: MapLayerMouseEvent) => void = useCallback(
    (e) => {
      if (e.features?.length === 1) {
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
      } else onAddMarker({ lat: e.lngLat.lat, lng: e.lngLat.lng });
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
      <MapGl
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
      </MapGl>
    </div>
  );
};
