"use client";
import { FC, FormEventHandler } from "react";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { Feature, Point } from "geojson";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { FilterButton } from "@/components/FilterButton";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessagePanel } from "@/components/MessagePanel";
import { Button } from "@/components/Button";
import { buildingToQueryParams } from "@/lib/buildingToQueryParams";
import { useBuildings } from "@/app/hooks/useBuildings";

export const MapPageContent: FC<SettingsType> = ({
  confirmationMessage,
  errorMessage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const shouldAdd = searchParams.has("add");
  const { buildings, loading } = useBuildings();
  const [hasSelectedFeature, setHasSelectedFeature] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Point, FeatureBuilding>>();
  const [isAdding, setIsAdding] = useState(shouldAdd);
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
  const [filter, setFilter] = useState<string>();
  const [addedBuilding, setAddedBuilding] = useState<boolean | undefined>();
  const [savingBuilding, setSavingBuilding] = useState(false);

  // this is for handling menu click when already on map page
  if (shouldAdd && !isAdding) {
    setIsAdding(true);
    setAddingLocation(undefined);
  }

  useEffect(() => {
    if (loading || !buildings) return;

    if (selectedId) {
      setSelectedFeature(
        buildings.features.find((f) => f.properties._id === selectedId),
      );
      setHasSelectedFeature(true);
    } else {
      setHasSelectedFeature(false);
    }
  }, [loading, buildings?.features, selectedId]);

  const handleAddMarker = useCallback((latLng: LatLng) => {
    // show popup with form
    setAddingLocation(latLng);
    setShowNewBuildingForm(true);
    router.replace(pathname);
  }, []);
  const handleCancelFeature = useCallback(() => {
    setIsAdding(false);
    setShowNewBuildingForm(false);
  }, []);
  const handleSubmitFeature: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      const formData = new FormData(e.target as HTMLFormElement);
      // save info from form
      setSavingBuilding(true);
      fetch("/api/buildings", {
        method: "POST",
        body: formData,
        cache: "no-cache",
      })
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          setAddingLocation(undefined);
          setIsAdding(false);
          setAddedBuilding(true);
        })
        .catch(() => {
          setAddedBuilding(false);
        })
        .finally(() => setSavingBuilding(false));
    },
    [],
  );
  const handleClickFeature: (id: string) => void = useCallback(
    (id) => {
      const feature = buildings?.features.find((f) => f.properties._id === id);
      if (!feature) return;
      setSelectedFeature(feature);
      setHasSelectedFeature(true);
      router.push(`${pathname}?${buildingToQueryParams(feature.properties)}`);
    },
    [buildings],
  );
  const clearSelectedFeature = useCallback(() => {
    setHasSelectedFeature(false);
    router.push(pathname);
  }, []);
  const handleClickAddBuilding: MouseEventHandler<HTMLButtonElement> =
    useCallback((e) => {
      e.stopPropagation();
      setAddingLocation(undefined);
      setIsAdding(true);
    }, []);

  const filteredFeatures: BuildingCollection = {
    type: "FeatureCollection",
    features:
      buildings?.features.filter(
        (f) => typeof filter === "undefined" || f.properties.state === filter,
      ) ?? [],
  };

  return (
    <>
      <header className="col-span-12 col-start-1 row-start-1">
        <Navigation />
      </header>
      <main className="col-span-12 col-start-1 row-start-2 grid w-full grid-cols-1 grid-rows-[auto_1fr]">
        <div className="col-start-1 row-start-1 mx-5 flex gap-2 pb-2">
          <FilterButton state="riven" onClick={setFilter} filter={filter} />
          <FilterButton state="hotad" onClick={setFilter} filter={filter} />
          <FilterButton state="räddad" onClick={setFilter} filter={filter} />
        </div>
        <div className="relative col-start-1 row-start-2 mx-5 mb-5">
          <div className="absolute bottom-12 left-5 z-10 sm:bottom-[40px]">
            <Button onClick={handleClickAddBuilding}>
              {isAdding ? (
                "Välj plats på kartan"
              ) : (
                <>
                  Lägg till<span className="hidden sm:inline"> byggnad</span>
                </>
              )}
            </Button>
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
      </main>
      <Transition
        show={hasSelectedFeature}
        className="relative z-10 col-span-12 col-start-1 row-span-2 row-start-1 grid overflow-scroll scroll-smooth bg-white sm:col-span-6 sm:col-start-1 md:col-span-5 md:col-start-1"
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-x-full"
        enterTo="translate-none"
        leave="transition-transform duration-300 ease-in delay-[10ms]"
        leaveFrom="translate-none"
        leaveTo="-translate-x-full"
      >
        {selectedFeature && (
          <DetailsPanel
            properties={selectedFeature.properties}
            onClose={clearSelectedFeature}
          />
        )}
      </Transition>
      <Transition
        show={showNewBuildingForm}
        className="relative z-10 col-span-12 col-start-1 row-span-2 row-start-1 grid overflow-scroll scroll-smooth bg-white p-5 sm:col-span-6 sm:col-start-1 md:col-span-5 md:col-start-1"
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-x-full"
        enterTo="translate-none"
        leave="transition-transform duration-300 ease-in delay-[10ms]"
        leaveFrom="translate-none"
        leaveTo="-translate-x-full"
      >
        {addingLocation && (
          <NewFeatureForm
            latLng={addingLocation}
            isSaving={savingBuilding}
            onCancel={handleCancelFeature}
            onSubmit={handleSubmitFeature}
          />
        )}
        {addedBuilding === true && (
          <MessagePanel
            {...confirmationMessage}
            onClose={() => {
              setShowNewBuildingForm(false);
              setTimeout(setAddedBuilding, 300, undefined);
            }}
          />
        )}
        {addedBuilding === false && (
          <MessagePanel
            {...errorMessage}
            onClose={() => {
              setShowNewBuildingForm(false);
              setTimeout(setAddedBuilding, 300, undefined);
            }}
          />
        )}
      </Transition>
    </>
  );
};
