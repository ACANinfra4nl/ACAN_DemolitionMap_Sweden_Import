"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { fetchBuildings } from "@/lib/fetchBuildings";
import { appendFeature } from "@/lib/geo";
import classNames from "classnames";
import { FeatureCollection } from "geojson";
import { MapGeoJSONFeature } from "maplibre-gl";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";

export default function MapPage() {
  const [selectedFeature, setSelectedFeature] = useState<MapGeoJSONFeature>();
  const [isAdding, setIsAdding] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
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
    setAddingLocation(latLng);
  }, []);
  const handleCancelFeature = useCallback(() => {
    setAddingLocation(undefined);
    setIsAdding(false);
  }, []);
  const handleSubmitFeature = useCallback(async (formData: FormData) => {
    // save info from form
    const feature = await create(formData);

    console.log(feature);
    // add new marker
    setFeatures((old) => appendFeature(old, feature));
    setAddingLocation(undefined);
    setIsAdding(false);
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
  const handleClickAddBuilding: MouseEventHandler<HTMLButtonElement> =
    useCallback((e) => {
      e.stopPropagation();
      setIsAdding(true);
    }, []);
  console.log(selectedFeature, isAdding, addingLocation);
  return (
    <main className="min-h-screen w-full grid grid-cols-2 grid-rows-1">
      <div className="absolute top-0 left-0 z-10">
        <Navigation />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleClickAddBuilding}
          className={classNames(isAdding && "underline")}
        >
          {isAdding ? "Click location to add" : "Add building"}
        </button>
      </div>
      <Map
        className="col-span-2 row-start-1 col-start-1"
        features={features}
        isAdding={isAdding}
        addingLocation={addingLocation}
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
      {addingLocation && (
        <div className="col-span-1 col-start-1 row-start-1 z-10 relative grid">
          <NewFeatureForm
            latLng={addingLocation}
            onCancel={handleCancelFeature}
            onSubmit={handleSubmitFeature}
          />
        </div>
      )}
    </main>
  );
}
