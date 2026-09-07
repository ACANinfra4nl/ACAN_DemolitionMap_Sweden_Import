import { FC, useCallback, useRef, useState } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  MapRef,
  Marker,
  NavigationControl,
  LngLatBoundsLike,
} from "react-map-gl/maplibre";
import type { Feature, Point } from "geojson";
import classNames from "clsx";
import {
  CLUSTERED_COUNT_LAYER_STYLE,
  CLUSTERED_LAYER_STYLE,
  OVERLAY_CLUSTERED_COUNT_LAYER_STYLE,
  OVERLAY_CLUSTERED_LAYER_STYLE,
  OVERLAY_COUNTRY_LABEL_STYLE,
  OVERLAY_UNCLUSTERED_LAYER_STYLE,
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
  overlayFeatures?: BuildingCollection;
  isAdding: boolean;
  addingLocation?: LatLng;
  onAddMarker: (latLng: LatLng) => boolean;
  onClickFeature: (id: string) => void;
  onClickOverlay?: (siteUrl: string) => void;
  className?: string;
  bounds: LngLatBoundsLike;
}

export const Map: FC<MapProps> = ({
  features,
  overlayFeatures,
  isAdding,
  addingLocation,
  onAddMarker,
  onClickFeature,
  onClickOverlay,
  className,
  bounds,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [cursor, setCursor] = useState("grab");

  const handleClickMap: (e: MapLayerMouseEvent) => void = useCallback(
    (e) => {
      e.preventDefault();
      if (isAdding) {
        const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        if (onAddMarker(coords)) {
          mapRef.current?.flyTo({ center: coords });
        }
        return;
      }

      const hits = e.features ?? [];
      if (hits.length === 0) return;

      const local =
        hits.find((feature) => feature.layer?.id === "unclustered-points") ??
        hits.find((feature) => feature.layer?.id === "cluster");
      const overlay =
        hits.find(
          (feature) => feature.layer?.id === "overlay-unclustered-points",
        ) ?? hits.find((feature) => feature.layer?.id === "overlay-cluster");
      const feature = local ?? overlay;
      if (!feature) return;

      if (feature.properties?.cluster === true) {
        mapRef.current?.flyTo({
          zoom: (mapRef.current.getZoom() ?? 0) + 2,
          center: e.lngLat,
        });
        return;
      }

      if (feature.layer?.id === "overlay-unclustered-points") {
        const siteUrl = feature.properties?.siteUrl as string | undefined;
        if (siteUrl) onClickOverlay?.(siteUrl);
        return;
      }

      setTimeout(
        onClickFeature,
        0,
        (feature as unknown as Feature<Point, FeatureBuilding>).properties._id,
      );
    },
    [isAdding, onAddMarker, onClickFeature, onClickOverlay],
  );

  const handleMouseEnter = useCallback(() => setCursor("pointer"), []);
  const handleMouseLeave = useCallback(() => setCursor("grab"), []);

  return (
    <div className={classNames("text-white", className)}>
      <ReactMapGl
        mapLib={import("maplibre-gl")}
        mapStyle={mapStyle}
        initialViewState={{
          bounds: bounds,
        }}
        onClick={handleClickMap}
        ref={mapRef}
        interactiveLayerIds={[
          "cluster",
          "unclustered-points",
          "overlay-cluster",
          "overlay-unclustered-points",
        ]}
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
        {overlayFeatures && overlayFeatures.features.length > 0 && (
          <Source
            id="overlay-annotations"
            type="geojson"
            data={overlayFeatures}
            cluster
            clusterMaxZoom={11}
            clusterRadius={20}
          >
            <Layer {...OVERLAY_CLUSTERED_LAYER_STYLE} />
            <Layer {...OVERLAY_CLUSTERED_COUNT_LAYER_STYLE} />
            <Layer {...OVERLAY_UNCLUSTERED_LAYER_STYLE} />
            <Layer {...OVERLAY_COUNTRY_LABEL_STYLE} />
          </Source>
        )}
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
