"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { buildingToFeature } from "@/lib/buildingToFeature";
import { appendFeature, latLngToFeature } from "@/lib/geo";
import { Feature, FeatureCollection } from "geojson";
import { MapGeoJSONFeature } from "maplibre-gl";
import { useCallback, useEffect, useState } from "react";

const fetchBuildings = () =>
  fetch("/api/buildings", { next: { tags: ["buildings"] } }).then((r) =>
    r.json()
  );

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<MapGeoJSONFeature>();
  const [isAddingFeature, setIsAddingFeature] = useState<LatLng>();
  const [features, setFeatures] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  useEffect(() => {
    fetchBuildings().then((b) =>
      setFeatures({
        type: "FeatureCollection",
        features: b.map(buildingToFeature),
      })
    );
  }, []);
  const handleAddMarker = useCallback((latLng: LatLng) => {
    // show popup with form
    setIsAddingFeature(latLng);
  }, []);
  const handleCancelFeature = useCallback(
    () => setIsAddingFeature(undefined),
    []
  );
  const handleSubmitFeature = useCallback(async (formData: FormData) => {
    // save info from form
    const feature = await create(formData);

    console.log(feature);
    // add new marker
    setFeatures((old) => appendFeature(old, feature));
    setIsAddingFeature(undefined);
  }, []);
  const handleClickMarker: (feature: MapGeoJSONFeature) => void = useCallback(
    (feature) => {
      console.log("clicked feature", feature.properties);
      setSelectedFeature(feature);
    },
    []
  );
  const clearSelectedFeature = useCallback(
    () => setSelectedFeature(undefined),
    []
  );
  console.log(features);
  return (
    <main className="min-h-screen w-full grid grid-cols-2 grid-rows-1">
      <Map
        className="col-span-2 row-start-1 col-start-1"
        features={features}
        onAddMarker={handleAddMarker}
        onClickFeature={handleClickMarker}
      />
      {selectedFeature && (
        <div className="col-span-1 col-start-1 row-start-1 z-10 relative grid">
          <DetailsPanel
            name={selectedFeature.properties.name}
            description={selectedFeature.properties.description}
            onClose={clearSelectedFeature}
          />
        </div>
      )}
      {isAddingFeature && (
        <div className="col-span-1 col-start-1 row-start-1 z-10 relative grid">
          <NewFeatureForm
            latLng={isAddingFeature}
            onCancel={handleCancelFeature}
            onSubmit={handleSubmitFeature}
          />
        </div>
      )}
    </main>
  );
}
