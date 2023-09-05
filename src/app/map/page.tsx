"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { fetchBuildings } from "@/lib/fetchBuildings";
import { appendFeature } from "@/lib/geo";
import { FeatureCollection } from "geojson";
import { MapGeoJSONFeature } from "maplibre-gl";
import { useCallback, useEffect, useState } from "react";

export default function MapPage() {
  const [selectedFeature, setSelectedFeature] = useState<MapGeoJSONFeature>();
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingFeature, setIsAddingFeature] = useState<LatLng>();
  const [features, setFeatures] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  useEffect(() => {
    fetchBuildings().then((b) =>
      setFeatures({
        type: "FeatureCollection",
        features: b,
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
  const handleClickAddBuilding = useCallback(() => {
    setIsAdding(true);
  }, []);
  console.log(selectedFeature);
  return (
    <main className="min-h-screen w-full grid grid-cols-2 grid-rows-1">
      <div className="absolute top-4 right-4">
        <button onClick={handleClickAddBuilding}>Add building</button>
      </div>
      <Map
        className="col-span-2 row-start-1 col-start-1"
        features={features}
        isAdding={isAdding}
        onAddMarker={handleAddMarker}
        onClickFeature={handleClickMarker}
      />
      {selectedFeature && (
        <div className="col-span-1 col-start-1 row-start-1 z-10 relative grid">
          <DetailsPanel
            name={selectedFeature.properties.name}
            description={selectedFeature.properties.description}
            image={selectedFeature.properties.image}
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
