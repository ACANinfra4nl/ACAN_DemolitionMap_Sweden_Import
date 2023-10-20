import { FC, useCallback, useRef, useState } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl/maplibre";
import type { Feature, Point } from "geojson";
import classNames from "classnames";
import {
  CLUSTERED_COUNT_LAYER_STYLE,
  CLUSTERED_LAYER_STYLE,
  UNCLUSTERED_LAYER_STYLE,
} from "./layers";
import { mapStyle } from "./style";
import pointerImage from "@/img/pointer.svg";
import markerImage from "@/img/marker.svg";

// Include style sheets
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";

interface MapProps {
  features: BuildingCollection;
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
  const [cursor, setCursor] = useState("grab");

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
          setTimeout(
            onClickFeature,
            0,
            (feature as unknown as Feature<Point, FeatureBuilding>).properties
              ._id,
          );
        }
      }
    },
    [isAdding, onAddMarker, onClickFeature],
  );

  const handleMouseEnter = useCallback(() => setCursor("pointer"), []);
  const handleMouseLeave = useCallback(() => setCursor("grab"), []);

  return (
    <div className={classNames("text-white", className)}>
      <ReactMapGl
        mapLib={import("maplibre-gl")}
        mapStyle={mapStyle}
        initialViewState={{ latitude: 59.3293, longitude: 18.0686, zoom: 5 }}
        onClick={handleClickMap}
        ref={mapRef}
        interactiveLayerIds={["cluster", "unclustered-points"]}
        cursor={
          isAdding
            ? addingLocation
              ? "grab"
              : `url("${pointerImage.src}") 18 30, crosshair`
            : cursor
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        {isAdding && addingLocation && (
          <Marker
            latitude={addingLocation.lat}
            longitude={addingLocation.lng}
            anchor="bottom"
            offset={[0, 6]}
          >
            <img src={markerImage.src} alt="" />
          </Marker>
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
