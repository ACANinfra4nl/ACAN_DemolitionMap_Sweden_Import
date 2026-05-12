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
import { clearAddBuildingDraft } from "@/lib/addBuildingDraft";

export const MapPageContent: FC<
  SettingsType & {
    buildings: {
      type: "FeatureCollection";
      features: Feature<Point, FeatureBuilding>[];
    };
    dict: Dictionary;
  }
> = ({ feedbackEmail, confirmationMessage, errorMessage, buildings, dict }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const shouldAdd = searchParams.has("add");
  const [hasSelectedFeature, setHasSelectedFeature] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Point, FeatureBuilding>>();
  const [isAdding, setIsAdding] = useState(shouldAdd);
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
  const [filter, setFilter] = useState<string>();
  const [addedBuilding, setAddedBuilding] = useState<boolean | undefined>();
  const [savingBuilding, setSavingBuilding] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  // this is for handling menu click when already on map page
  if (shouldAdd && !isAdding) {
    setIsAdding(true);
    setAddingLocation(undefined);
  }

  useEffect(() => {
    if (selectedId) {
      setSelectedFeature(
        buildings.features.find((f) => f.properties._id === selectedId),
      );
      setHasSelectedFeature(true);
    } else {
      setHasSelectedFeature(false);
    }
  }, [selectedId, buildings.features]);

  const handleAddMarker = useCallback(
    (latLng: LatLng) => {
      setAddingLocation(latLng);
      setShowNewBuildingForm(true);
      router.replace(pathname);
    },
    [pathname, router],
  );
  const handleCancelFeature = useCallback(() => {
    setIsAdding(false);
    setShowNewBuildingForm(false);
  }, []);
  const handleSubmitFeature: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      // save info from form
      setSavingBuilding(true);
      document.body.classList.add("waiting");
      fetch("/api/buildings", {
        method: "POST",
        body: formData,
        cache: "no-cache",
      })
        .then(async (r) => {
          if (!r.ok) {
            let message = r.statusText;
            try {
              const body = (await r.json()) as { error?: string };
              if (body?.error) message = body.error;
            } catch {
              // keep status text fallback when body is not JSON
            }
            throw new Error(message);
          }
          setAddingLocation(undefined);
          setIsAdding(false);
          setSubmitError(undefined);
          setAddedBuilding(true);
          clearAddBuildingDraft();
          router.refresh();
        })
        .catch((error) => {
          // Keep the existing UI behavior, but expose details in dev tools for faster debugging.
          console.error("Building submission failed:", error);
          setSubmitError(
            error instanceof Error ? error.message : "Unknown submission error",
          );
          setAddedBuilding(false);
        })
        .finally(() => {
          setSavingBuilding(false);
          document.body.classList.remove("waiting");
        });
    },
    [router],
  );

  const handleClickFeature: (id: string) => void = useCallback(
    (id) => {
      const feature = buildings?.features.find((f) => f.properties._id === id);
      if (!feature) return;
      setSelectedFeature(feature);
      setHasSelectedFeature(true);
      router.push(`${pathname}?${buildingToQueryParams(feature.properties)}`);
    },
    [buildings?.features, pathname, router],
  );
  const clearSelectedFeature = useCallback(() => {
    setHasSelectedFeature(false);
    router.push(pathname);
  }, [pathname, router]);
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
        <Navigation dict={dict} />
      </header>
      <main className="col-span-12 col-start-1 row-start-2 grid w-full grid-cols-1 grid-rows-[auto_1fr]">
        <div className="col-start-1 row-start-1 mx-5 flex gap-2 pb-2">
          <FilterButton
            state={dict.states.demolished}
            onClick={setFilter}
            filter={filter}
            dictStates={dict.states}
          />
          <FilterButton
            state={dict.states.threatened}
            onClick={setFilter}
            filter={filter}
            dictStates={dict.states}
          />
          <FilterButton
            state={dict.states.saved}
            onClick={setFilter}
            filter={filter}
            dictStates={dict.states}
          />
        </div>
        <div className="relative col-start-1 row-start-2 mx-5 mb-5">
          <div className="absolute bottom-12 left-5 z-10 sm:bottom-[40px]">
            <Button onClick={handleClickAddBuilding}>
              {isAdding ? (
                dict.newFeatureForm.addLocation
              ) : (
                <>
                  {dict.nav.addOne}
                  <span className="hidden sm:inline"> {dict.nav.addTwo}</span>
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
            bounds={dict.map.bounds}
          />
        </div>
      </main>
      <Transition
        show={hasSelectedFeature}
        className="relative z-10 col-span-12 col-start-1 row-span-2 row-start-1 flex min-h-0 flex-col overflow-y-auto scroll-smooth bg-white sm:col-span-6 sm:col-start-1 md:col-span-5 md:col-start-1"
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-x-full"
        enterTo="translate-none"
        leave="transition-transform duration-300 ease-in delay-[10ms]"
        leaveFrom="translate-none"
        leaveTo="-translate-x-full"
      >
        {selectedFeature && (
          <DetailsPanel
            feedbackEmail={feedbackEmail}
            properties={selectedFeature.properties}
            onClose={clearSelectedFeature}
            dict={dict}
          />
        )}
      </Transition>
      <Transition
        show={showNewBuildingForm}
        className="relative z-10 col-span-12 col-start-1 row-span-2 row-start-1 flex min-h-0 flex-col overflow-y-auto scroll-smooth bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:col-span-6 sm:col-start-1 md:col-span-5 md:col-start-1"
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
            dict={dict}
          />
        )}
        {addedBuilding === true && (
          <MessagePanel
            {...confirmationMessage}
            onClose={() => {
              setShowNewBuildingForm(false);
              setTimeout(setAddedBuilding, 300, undefined);
            }}
            dict={dict}
          />
        )}
        {addedBuilding === false && (
          <MessagePanel
            {...errorMessage}
            details={submitError}
            onClose={() => {
              setShowNewBuildingForm(false);
              setTimeout(setAddedBuilding, 300, undefined);
            }}
            dict={dict}
          />
        )}
      </Transition>
    </>
  );
};
