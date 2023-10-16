"use client";
import { create } from "@/actions/create";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { BuildingsContext } from "@/state/buildings";
import { Feature, Point } from "geojson";
import {
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FilterButton } from "../../components/FilterButton";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessagePanel } from "@/components/MessagePanel";
import { Button } from "@/components/Button";

export default function MapPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const features = useContext(BuildingsContext);
  const [hasSelectedFeature, setHasSelectedFeature] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Point, FeatureBuilding>>();
  const [isAdding, setIsAdding] = useState(false);
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false);
  const [addingLocation, setAddingLocation] = useState<LatLng>();
  // const dispatch = useContext(BuildingsDispatchContext);
  const [filter, setFilter] = useState<string>();
  const [addedBuilding, setAddedBuilding] = useState<boolean | undefined>();
  const [savingBuilding, setSavingBuilding] = useState(false);

  useEffect(() => {
    if (features.loading) return;

    if (selectedId) {
      setSelectedFeature(
        features.features.find((f) => f.properties._id === selectedId),
      );
      setHasSelectedFeature(true);
    } else {
      setHasSelectedFeature(false);
    }
  }, [features.loading, features.features, selectedId]);

  const handleAddMarker = useCallback((latLng: LatLng) => {
    // show popup with form
    setShowNewBuildingForm(true);
    setAddingLocation(latLng);
  }, []);
  const handleCancelFeature = useCallback(() => {
    // setAddingLocation(undefined);
    setIsAdding(false);
    setShowNewBuildingForm(false);
  }, []);
  const handleSubmitFeature = useCallback((formData: FormData) => {
    // save info from form
    // const feature =
    setSavingBuilding(true);
    create(formData)
      .then(() => {
        setAddingLocation(undefined);
        setIsAdding(false);
        setAddedBuilding(true);
      })
      .catch(() => {
        setAddedBuilding(false);
      })
      .finally(() => setSavingBuilding(false));
  }, []);
  const handleClickFeature: (id: string) => void = useCallback(
    (id) => {
      const feature = features.features.find((f) => f.properties._id === id);
      setSelectedFeature(feature);
      setHasSelectedFeature(true);
      router.push(`${pathname}?view=${id}`);
    },
    [features],
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
    features: features.features.filter(
      (f) => typeof filter === "undefined" || f.properties.state === filter,
    ),
  };

  return (
    <div className="grid h-screen grid-cols-10 grid-rows-[auto_1fr]">
      <header className="col-span-10 col-start-1 row-start-1">
        <Navigation />
      </header>
      <main className="col-span-10 col-start-1 row-start-2 grid w-full grid-cols-1 grid-rows-[auto_1fr]">
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
        className="relative z-10 col-span-10 col-start-1 row-span-2 row-start-1 grid bg-white sm:col-span-6 sm:col-start-1 md:col-span-4 md:col-start-1"
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-x-full"
        enterTo="translate-none"
        leave="transition-transform duration-300 ease-out delay-[10ms]"
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
        className="relative z-10 col-span-10 col-start-1 row-span-2 row-start-1 grid overflow-scroll scroll-smooth bg-white p-5 sm:col-span-6 sm:col-start-1 md:col-span-4 md:col-start-1"
      >
        {addingLocation && !savingBuilding && (
          <NewFeatureForm
            latLng={addingLocation}
            onCancel={handleCancelFeature}
            onSubmit={handleSubmitFeature}
          />
        )}
        {addingLocation && savingBuilding && <div>Sparar...</div>}
        {addedBuilding === true && (
          <MessagePanel
            title="Tack för ditt bidrag"
            onClose={() => {
              setShowNewBuildingForm(false);
              setAddedBuilding(undefined);
            }}
          >
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
              ullam.
            </p>
          </MessagePanel>
        )}
        {addedBuilding === false && (
          <MessagePanel
            title="Något gick fel"
            onClose={() => {
              setShowNewBuildingForm(false);
              setAddedBuilding(undefined);
            }}
          >
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
              ullam.
            </p>
          </MessagePanel>
        )}
      </Transition>
    </div>
  );
}
