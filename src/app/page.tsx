"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { BuildingsContext } from "@/state/buildings";
import { Feature, Point } from "geojson";
import { MouseEventHandler, useCallback, useContext, useState } from "react";
import { FilterButton } from "../components/FilterButton";

export default function MapPage() {
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Point, FeatureBuilding>>();
  const [isAdding, setIsAdding] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
  const features = useContext(BuildingsContext);
  // const dispatch = useContext(BuildingsDispatchContext);
  const [filter, setFilter] = useState<string>();

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

  const filteredFeatures: BuildingCollection = {
    type: "FeatureCollection",
    features: features.features.filter(
      (f) => typeof filter === "undefined" || f.properties.state === filter,
    ),
  };

  return (
    <main className="grid min-h-screen w-full grid-cols-2 grid-rows-[auto_auto_1fr]">
      <div className="col-span-2 col-start-1 row-start-1">
        <Navigation />
      </div>

      <div className="col-span-2 col-start-1 row-start-2 mx-5 flex gap-2 pb-2">
        <FilterButton state="riven" onClick={setFilter} filter={filter} />
        <FilterButton state="hotad" onClick={setFilter} filter={filter} />
        <FilterButton state="räddad" onClick={setFilter} filter={filter} />
      </div>
      <div className="relative col-span-2 col-start-1 row-start-3 mx-5 mb-5">
        <div className="absolute bottom-12 left-5 z-10 sm:bottom-[40px]">
          <button
            onClick={handleClickAddBuilding}
            className="h-12 rounded-md bg-black px-4 text-white transition-colors hover:bg-black/50"
          >
            {isAdding ? (
              "Välj plats på kartan"
            ) : (
              <>
                Lägg till<span className="hidden sm:inline"> byggnad</span>
              </>
            )}
          </button>
        </div>
        <Map
          className="h-full w-full"
          features={filteredFeatures}
          isAdding={isAdding}
          addingLocation={addingLocation}
          onAddMarker={handleAddMarker}
          onClickFeature={handleClickFeature}
        />
      </div>
      {selectedFeature && (
        <div className="relative z-10 col-span-1 col-start-1 row-span-3 row-start-1 grid bg-white">
          <DetailsPanel
            properties={selectedFeature.properties}
            onClose={clearSelectedFeature}
          />
        </div>
      )}
      {addingLocation && (
        <div className="relative z-10 col-span-1 col-start-1 row-span-3 row-start-1 grid">
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
