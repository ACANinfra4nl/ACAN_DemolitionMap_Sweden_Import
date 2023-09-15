"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { BuildingsContext } from "@/state/buildings";
import { Feature, Point } from "geojson";
import { MouseEventHandler, useCallback, useContext, useState } from "react";

export default function MapPage() {
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Point, FeatureBuilding>>();
  const [isAdding, setIsAdding] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
  const features = useContext(BuildingsContext);
  // const dispatch = useContext(BuildingsDispatchContext);

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
    // const feature =
    await create(formData);

    // TODO: show some sort of "thank you for contributing, someone will publish your entry shortly" message
    alert(
      "Tack för ditt bidrag! Informationen verifieras innan den syns på kartan."
    );
    // add new marker
    // dispatch({ type: ACTIONS.ADD_BUILDING, payload: feature });
    setAddingLocation(undefined);
    setIsAdding(false);
  }, []);
  const handleClickFeature: (id: string) => void = useCallback(
    (id) => {
      const feature = features.features.find((f) => f.properties._id === id);
      setSelectedFeature(feature);
    },
    [features]
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

  return (
    <main className="min-h-screen w-full grid grid-cols-2 grid-rows-[auto_1fr]">
      <div className="row-start-1 col-span-2">
        <Navigation color="text-red-600" />
      </div>

      <div className="absolute left-0 right-0 flex items-center justify-center bottom-[62px] sm:bottom-[38px] z-10 ml-8 mr-40 sm:ml-40">
        <button
          onClick={handleClickAddBuilding}
          className="border-[3px] border-red-600 bg-white text-red-600 h-12 px-4"
        >
          {isAdding ? (
            "Välj plats på kartan"
          ) : (
            <>
              + Lägg till<span className="hidden sm:inline"> byggnad</span>
            </>
          )}
        </button>
      </div>
      <Map
        className="col-span-2 row-start-2 col-start-1"
        features={features}
        isAdding={isAdding}
        addingLocation={addingLocation}
        onAddMarker={handleAddMarker}
        onClickFeature={handleClickFeature}
      />
      {selectedFeature && (
        <div className="col-span-1 col-start-1 row-start-2 z-10 relative grid">
          <DetailsPanel
            properties={selectedFeature.properties}
            onClose={clearSelectedFeature}
          />
        </div>
      )}
      {addingLocation && (
        <div className="col-span-1 col-start-1 row-start-2 z-10 relative grid">
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
