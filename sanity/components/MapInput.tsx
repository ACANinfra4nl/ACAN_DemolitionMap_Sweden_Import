import { FC, MouseEventHandler, useCallback, useRef } from "react";
import { Stack, Button, Text } from "@sanity/ui";
import { PatchEvent, set } from "sanity";
import ReactMapGl, {
  MapLayerMouseEvent,
  Marker,
  AttributionControl,
  MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapStyle } from "@/components/Map/style";

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
          mapStyle={mapStyle}
          initialViewState={
            hasValue
              ? {
                  latitude: props.value.lat,
                  longitude: props.value.lng,
                  zoom: 15,
                }
              : { bounds: [3.2, 50.7, 7.2, 53.7] }
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
      <div className="flex items-center gap-2">
        <Text>
          {hasValue ? (
            <>
              ({props.value.lat}, {props.value.lng})
            </>
          ) : (
            "(-, -)"
          )}
        </Text>
        <Button
          onClick={handleCenterMapClick}
          mode="ghost"
          disabled={!hasValue}
          paddingY={1}
        >
          Centrera
        </Button>
      </div>
    </Stack>
  );
};
