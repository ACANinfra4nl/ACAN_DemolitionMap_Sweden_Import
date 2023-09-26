import { FC, useCallback, useRef } from "react";
import ReactMapGl, {
  MapLayerMouseEvent,
  Source,
  Layer,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl/maplibre";
import type { Feature, FeatureCollection, Point } from "geojson";

// Include style sheet
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import classNames from "classnames";
import imgRiven from "./riven.png";
import imgHotad from "./hotad.png";
import imgRäddad from "./räddad.png";
import { LegendControl } from "./LegendControl";
import {
  CLUSTERED_COUNT_LAYER_STYLE,
  CLUSTERED_LAYER_STYLE,
  UNCLUSTERED_LAYER_STYLE,
  UNCLUSTERED_SYMBOL_LAYER_STYLE,
} from "./layers";

function loadImage(map: MapRef, id: string, src: string): Promise<void> {
  console.log("loading image", id);
  if (map.hasImage(id)) return Promise.resolve();
  return new Promise((resolve, reject) =>
    map.loadImage(src, (err, img) => {
      if (err || !img) return reject(err);
      map.addImage(id, img);
      resolve();
    }),
  );
}

interface MapProps {
  features: BuildingCollection;
  isAdding: boolean;
  addingLocation?: LatLng;
  onAddMarker: (latLng: LatLng) => void;
  onClickFeature: (id: string) => void;
  onFilter?: (state?: string) => void;
  className?: string;
}

export const Map: FC<MapProps> = ({
  features,
  isAdding,
  addingLocation,
  onAddMarker,
  onClickFeature,
  onFilter,
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
              ._id,
          );
        }
      }
    },
    [isAdding, onAddMarker, onClickFeature],
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
          <Layer {...UNCLUSTERED_SYMBOL_LAYER_STYLE} />
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
        {onFilter && (
          <LegendControl
            position="top-right"
            demolishedSrc={imgRiven.src}
            threatenedSrc={imgHotad.src}
            savedSrc={imgRäddad.src}
            onClick={onFilter}
          />
        )}
      </ReactMapGl>
    </div>
  );
};
