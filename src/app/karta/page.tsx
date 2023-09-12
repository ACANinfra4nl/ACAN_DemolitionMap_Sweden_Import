"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import {
  ACTIONS,
  BuildingsContext,
  BuildingsDispatchContext,
} from "@/state/buildings";
import classNames from "classnames";
import { Feature, Point } from "geojson";
import { MouseEventHandler, useCallback, useContext, useState } from "react";

export default function MapPage() {
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Point, FeatureBuilding>>();
  const [isAdding, setIsAdding] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
  const features = useContext(BuildingsContext);
  const dispatch = useContext(BuildingsDispatchContext);

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

    // add new marker
    dispatch({ type: ACTIONS.ADD_BUILDING, payload: feature });
    setAddingLocation(undefined);
    setIsAdding(false);
  }, []);
  const handleClickFeature: (id: string) => void = useCallback((id) => {
    const feature = features.features.find((f) => f.properties._id === id);
    // console.log("hittade matchande feature", feature, id);
    setSelectedFeature(feature);
  }, []);
  const clearSelectedFeature = useCallback(
    () => setSelectedFeature(undefined),
    []
  );
  const handleClickAddBuilding: MouseEventHandler<HTMLButtonElement> =
    useCallback((e) => {
      e.stopPropagation();
      setIsAdding(true);
    }, []);

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
          {isAdding ? "Välj plats på kartan" : "Lägg till byggnad"}
        </button>
      </div>
      <Map
        className="col-span-2 row-start-1 col-start-1"
        features={features}
        isAdding={isAdding}
        addingLocation={addingLocation}
        onAddMarker={handleAddMarker}
        onClickFeature={handleClickFeature}
      />
      {selectedFeature && (
        <div className="col-span-1 col-start-1 row-start-1 z-10 relative grid">
          <DetailsPanel
            properties={selectedFeature.properties}
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
