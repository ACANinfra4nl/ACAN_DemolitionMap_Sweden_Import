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
      "Tack för ditt bidrag! Informationen verifieras innan den syns på kartan.",
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
    [features],
  );
  const clearSelectedFeature = useCallback(
    () => setSelectedFeature(undefined),
    [],
  );
  const handleClickAddBuilding: MouseEventHandler<HTMLButtonElement> =
    useCallback((e) => {
      e.stopPropagation();
      setIsAdding(true);
    }, []);

  return (
    <main className="grid min-h-screen w-full grid-cols-2 grid-rows-[auto_1fr]">
      <div className="col-span-2 row-start-1">
        <Navigation color="text-red-600" />
      </div>

      <div className="absolute bottom-[62px] left-0 right-0 z-10 ml-8 mr-40 flex items-center justify-center sm:bottom-[38px] sm:ml-40">
        <button
          onClick={handleClickAddBuilding}
          className="h-12 border-[3px] border-red-600 bg-white px-4 text-red-600"
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
        className="col-span-2 col-start-1 row-start-2"
        features={features}
        isAdding={isAdding}
        addingLocation={addingLocation}
        onAddMarker={handleAddMarker}
        onClickFeature={handleClickFeature}
      />
      {selectedFeature && (
        <div className="relative z-10 col-span-1 col-start-1 row-start-2 grid bg-white">
          <DetailsPanel
            properties={selectedFeature.properties}
            onClose={clearSelectedFeature}
          />
        </div>
      )}
      {addingLocation && (
        <div className="relative z-10 col-span-1 col-start-1 row-start-2 grid">
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
