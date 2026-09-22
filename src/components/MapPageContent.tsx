"use client";
import { DetailsPanel } from "@/components/DetailsPanel";
import { Map } from "@/components/Map";
import { Navigation } from "@/components/Navigation";
import { NewFeatureForm } from "@/components/NewFeatureForm";
import { Feature, Point } from "geojson";
import {
  FC,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FilterButton } from "@/components/FilterButton";
import { Transition } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessagePanel } from "@/components/MessagePanel";
import { Button } from "@/components/Button";
import { buildingToQueryParams } from "@/lib/buildingToQueryParams";
import { clearAddBuildingDraft } from "@/lib/addBuildingDraft";
import { LayerSettings } from "@/components/Map/LayerSettings";
import {
  COUNTRY_DEPLOYMENTS,
  getHomeCountryCode,
  type CountrySanityLocale,
} from "@/lib/countrySanity";
import { toFeature } from "@/lib/toFeature";
import { isPointInCountry } from "@/lib/pointInCountry";

export const MapPageContent: FC<
  SettingsType & {
    buildings: {
      type: "FeatureCollection";
      features: Feature<Point, FeatureBuilding>[];
    };
    dict: Dictionary;
    countryCode?: CountrySanityLocale;
    logoUrl?: string;
  }
> = ({
  feedbackEmail,
  confirmationMessage,
  errorMessage,
  buildings,
  dict,
  countryCode,
  logoUrl,
}) => {
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
  const homeCountry = countryCode ?? getHomeCountryCode();
  const [overlayCountries, setOverlayCountries] = useState<
    CountrySanityLocale[]
  >([]);
  const [overlayBuildings, setOverlayBuildings] = useState<BuildingCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [submittedFeatures, setSubmittedFeatures] = useState<
    Feature<Point, FeatureBuilding>[]
  >([]);
  const mapFeatures = useMemo(() => {
    const ids = new Set(buildings.features.map((f) => f.properties._id));
    return [
      ...buildings.features,
      ...submittedFeatures.filter((f) => !ids.has(f.properties._id)),
    ];
  }, [buildings.features, submittedFeatures]);

  // this is for handling menu click when already on map page
  if (shouldAdd && !isAdding) {
    setIsAdding(true);
    setAddingLocation(undefined);
  }

  useEffect(() => {
    const ids = new Set(buildings.features.map((f) => f.properties._id));
    setSubmittedFeatures((current) =>
      current.filter((f) => !ids.has(f.properties._id)),
    );
  }, [buildings.features]);

  useEffect(() => {
    if (selectedId) {
      setSelectedFeature(
        mapFeatures.find((f) => f.properties._id === selectedId),
      );
      setHasSelectedFeature(true);
    } else {
      setHasSelectedFeature(false);
    }
  }, [selectedId, mapFeatures]);

  useEffect(() => {
    if (overlayCountries.length === 0) {
      setOverlayBuildings({ type: "FeatureCollection", features: [] });
      return;
    }

    const params = new URLSearchParams({
      countries: overlayCountries.join(","),
    });
    let cancelled = false;
    fetch(`/api/global-buildings?${params.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json() as Promise<BuildingCollection>;
      })
      .then((collection) => {
        if (cancelled) return;
        setOverlayBuildings({
          type: "FeatureCollection",
          features: (collection.features ?? []).map((feature) =>
            toFeature(feature.properties as FeatureBuilding, dict),
          ),
        });
      })
      .catch((error) => {
        console.error("Overlay buildings failed:", error);
        if (!cancelled) {
          setOverlayBuildings({ type: "FeatureCollection", features: [] });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [overlayCountries, dict]);

  const handleAddMarker = useCallback(
    (latLng: LatLng) => {
      if (
        !homeCountry ||
        !isPointInCountry(latLng.lat, latLng.lng, homeCountry)
      ) {
        return false;
      }
      setAddingLocation(latLng);
      setShowNewBuildingForm(true);
      router.replace(pathname);
      return true;
    },
    [homeCountry, pathname, router],
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
          try {
            const created = (await r.json()) as Feature<
              Point,
              FeatureBuilding
            >;
            if (
              created?.properties?._id &&
              typeof created.properties.location?.lat === "number" &&
              typeof created.properties.location?.lng === "number"
            ) {
              const feature = toFeature(created.properties, dict);
              setSubmittedFeatures((current) => [
                ...current.filter(
                  (item) => item.properties._id !== feature.properties._id,
                ),
                feature,
              ]);
            }
          } catch {
            // Map still refreshes from the server if the create payload is unreadable.
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
    [dict, router],
  );

  const handleClickFeature: (id: string) => void = useCallback(
    (id) => {
      const feature = mapFeatures.find((f) => f.properties._id === id);
      if (!feature) return;
      setSelectedFeature(feature);
      setHasSelectedFeature(true);
      router.push(`${pathname}?${buildingToQueryParams(feature.properties)}`);
    },
    [mapFeatures, pathname, router],
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

  const handleToggleOverlayCountry = useCallback(
    (country: CountrySanityLocale) => {
      setOverlayCountries((current) =>
        current.includes(country)
          ? current.filter((value) => value !== country)
          : [...current, country],
      );
    },
    [],
  );

  const handleClickOverlay = useCallback((siteUrl: string) => {
    window.open(siteUrl, "_blank", "noopener,noreferrer");
  }, []);

  const filteredFeatures: BuildingCollection = {
    type: "FeatureCollection",
    features:
      mapFeatures.filter(
        (f) => typeof filter === "undefined" || f.properties.state === filter,
      ),
  };

  const filteredOverlay: BuildingCollection = {
    type: "FeatureCollection",
    features: overlayBuildings.features.filter(
      (f) => typeof filter === "undefined" || f.properties.state === filter,
    ),
  };

  return (
    <>
      <header className="col-span-12 col-start-1 row-start-1">
          <Navigation dict={dict} logoUrl={logoUrl} />
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
          {homeCountry &&
          COUNTRY_DEPLOYMENTS[homeCountry].features.overlayLayers ? (
            <LayerSettings
              homeCountry={homeCountry}
              enabledCountries={overlayCountries}
              onToggle={handleToggleOverlayCountry}
              dict={dict}
            />
          ) : null}
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
            overlayFeatures={filteredOverlay}
            isAdding={isAdding}
            addingLocation={addingLocation}
            onAddMarker={handleAddMarker}
            onClickFeature={handleClickFeature}
            onClickOverlay={handleClickOverlay}
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
