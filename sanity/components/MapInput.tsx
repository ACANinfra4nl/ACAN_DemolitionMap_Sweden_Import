import { FC, MouseEventHandler, useCallback, useRef } from "react";
import { Stack, Button } from "@sanity/ui";
import { PatchEvent, set } from "sanity";
import ReactMapGl, {
  MapLayerMouseEvent,
  Marker,
  AttributionControl,
  MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapInputProps {
  value: {
    _type: "geopoint";
    lat: number;
    lng: number;
  };
  readOnly: boolean;
  onChange: (e: PatchEvent) => unknown;
}

export const MapInput: FC<MapInputProps> = (props) => {
  const mapRef = useRef<MapRef>(null);

  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const patch = set({
      _type: "geopoint",
      lat: e.lngLat.lat,
      lng: e.lngLat.lng,
    });
    props.onChange(PatchEvent.from(patch));
  }, []);
  const handleCenterMapClick: MouseEventHandler = useCallback(() => {
    if (!props.value) return;
    mapRef.current?.flyTo({ center: props.value, zoom: 15 });
  }, []);

  const hasValue =
    props.value &&
    typeof props.value.lat === "number" &&
    typeof props.value.lng === "number";

  return (
    <Stack space={2}>
      <div style={{ aspectRatio: 3 / 2, backgroundColor: "lightgrey" }}>
        <ReactMapGl
          mapLib={import("maplibre-gl")}
          mapStyle="https://api.maptiler.com/maps/abbe45d8-df15-4288-ab89-0a96d0eb6269/style.json?key=0VxOnlQWkxpRRW7vyr9t"
          initialViewState={
            hasValue
              ? {
                  latitude: props.value.lat,
                  longitude: props.value.lng,
                  zoom: 15,
                }
              : { latitude: 59.3293, longitude: 18.0686, zoom: 5 }
          }
          attributionControl={false}
          onClick={props.readOnly ? undefined : handleMapClick}
          ref={mapRef}
        >
          {hasValue && (
            <Marker
              latitude={props.value.lat}
              longitude={props.value.lng}
              color="black"
            />
          )}
          <AttributionControl position="bottom-right" compact />
        </ReactMapGl>
      </div>
      <Button onClick={handleCenterMapClick} mode="ghost" disabled={!hasValue}>
        {hasValue ? (
          <>
            ({props.value.lat}, {props.value.lng})
          </>
        ) : (
          "Ingen plats vald"
        )}
      </Button>
    </Stack>
  );
};
