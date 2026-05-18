import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CloseButton } from "./CloseButton";
import { categories } from "@/lib/categories";
import { states } from "@/lib/states";
import { Input } from "./forms/Input";
import { Select } from "./forms/Select";
import { TextArea } from "./forms/TextArea";
import { formatAddress } from "../lib/formatAddress";
import { ImageInput } from "./forms/ImageInput";
import { Button } from "./Button";
import {
  loadAddBuildingDraft,
  persistAddBuildingDraft,
} from "@/lib/addBuildingDraft";

interface NewFeatureFormProps {
  latLng: LatLng;
  isSaving?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  dict: Dictionary;
}

export const NewFeatureForm = ({
  latLng,
  isSaving,
  onCancel,
  onSubmit,
  dict,
}: NewFeatureFormProps) => {
  const panelEl = useRef<HTMLDivElement>(null);
  const formEl = useRef<HTMLFormElement>(null);
  const draftTimerRef = useRef<number | undefined>(undefined);
  const hadImagesRef = useRef(false);

  const { fields: draftFields, hadImages: draftHadImages } = useMemo(
    () => loadAddBuildingDraft(latLng),
    [latLng.lat, latLng.lng],
  );

  const [lookupResult, setLookupResult] = useState<ReverseGeocodeResult>();
  const [isDemolished, setIsDemolished] = useState(
    () => draftFields.state === "riven",
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    hadImagesRef.current = draftHadImages;
  }, [draftHadImages]);

  const flushDraftTimer = useCallback(() => {
    if (draftTimerRef.current !== undefined) {
      window.clearTimeout(draftTimerRef.current);
      draftTimerRef.current = undefined;
    }
  }, []);

  const scheduleDraftPersist = useCallback(() => {
    flushDraftTimer();
    draftTimerRef.current = window.setTimeout(() => {
      if (formEl.current) {
        persistAddBuildingDraft(formEl.current, hadImagesRef.current);
      }
    }, 400);
  }, [flushDraftTimer]);

  useEffect(() => () => flushDraftTimer(), [flushDraftTimer]);

  const updateFormValidity = useCallback(() => {
    setIsFormValid(formEl.current?.checkValidity() ?? false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/reverse?lat=${latLng.lat}&lng=${latLng.lng}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) return undefined;
        const text = await r.text();
        if (!text) return undefined;
        return JSON.parse(text) as ReverseGeocodeResult;
      })
      .then((result) => {
        if (result) setLookupResult(result);
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") {
          console.error("Reverse geocoding failed:", error);
        }
      });
    return () => controller.abort();
  }, [latLng.lat, latLng.lng]);

  useEffect(() => {
    (
      panelEl.current?.querySelector(
        "form *:is(input, textarea, select):not([type=hidden], :disabled)",
      ) as HTMLElement | undefined
    )?.focus();
    return () => {
      document.body.classList.remove("waiting");
    };
  }, []);

  useEffect(() => {
    const form = formEl.current;
    if (!form) return;
    const setNamed = (name: string, value: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (el) el.value = value;
    };
    if (lookupResult) {
      setNamed("address", lookupResult.address ?? "");
      setNamed("postcode", lookupResult.postcode ?? "");
      setNamed("city", lookupResult.city ?? "");
    } else {
      setNamed("address", draftFields.address ?? "");
      setNamed("postcode", draftFields.postcode ?? "");
      setNamed("city", draftFields.city ?? "");
    }
    if (formEl.current) {
      persistAddBuildingDraft(formEl.current, hadImagesRef.current);
    }
  }, [
    lookupResult,
    draftFields.address,
    draftFields.postcode,
    draftFields.city,
  ]);

  const handleChangeState: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      setIsDemolished(e.currentTarget.value === "riven");
      updateFormValidity();
    },
    [updateFormValidity],
  );

  const handleFormChange = useCallback(() => {
    updateFormValidity();
    scheduleDraftPersist();
  }, [scheduleDraftPersist, updateFormValidity]);

  const handleImagesCountChange = useCallback(
    (count: number) => {
      hadImagesRef.current = count > 0;
      scheduleDraftPersist();
    },
    [scheduleDraftPersist],
  );

  useEffect(() => {
    updateFormValidity();
  }, [isDemolished, updateFormValidity]);

  const readonlyAddressKey = lookupResult
    ? `geo-${lookupResult.address}-${lookupResult.postcode}`
    : `draft-${draftFields.address ?? ""}-${draftFields.postcode ?? ""}`;

  return (
    <div ref={panelEl}>
      <CloseButton onClick={onCancel} close={dict.ariaLabels.close} />
      <form
        ref={formEl}
        onSubmit={onSubmit}
        onInput={handleFormChange}
        onChange={handleFormChange}
        autoComplete="off"
      >
        <fieldset
          disabled={isSaving}
          className="flex flex-col gap-4 disabled:text-disabled"
        >
          <legend className="acan-text-menu mb-4 first-letter:uppercase">
            {dict.newFeatureForm.addBuilding}
          </legend>
          <input type="hidden" name="lat" value={latLng.lat} />
          <input type="hidden" name="lng" value={latLng.lng} />
          <div>
            <ImageInput
              label={dict.newFeatureForm.imageLabel}
              text={dict.newFeatureForm.imageInput}
              maxSizeText={dict.newFeatureForm.imageMaxSize}
              required
              requiredMessage={dict.newFeatureForm.imageRequired}
              ariaLabels={dict.ariaLabels}
              onValidityChange={updateFormValidity}
              onImagesCountChange={handleImagesCountChange}
            />
            {draftHadImages ? (
              <p className="mt-2 text-sm text-demolished first-letter:uppercase">
                {dict.newFeatureForm.draftRestoreImagesHint}
              </p>
            ) : null}
          </div>

          <div>
            <Select
              label={dict.newFeatureForm.category}
              name="category"
              options={categories}
              required
              formList={dict.categories}
              defaultValue={draftFields.category ?? ""}
            />
          </div>
          <div>
            <Select
              label={dict.newFeatureForm.state}
              name="state"
              options={states}
              required
              defaultValue={draftFields.state ?? ""}
              onChange={handleChangeState}
              formList={dict.states}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.buildingName}
              name="buildingName"
              defaultValue={draftFields.buildingName ?? ""}
            />
          </div>
          <div>
            <Input
              key={readonlyAddressKey}
              label={dict.newFeatureForm.address}
              name=""
              defaultValue={formatAddress(
                lookupResult?.address ?? draftFields.address,
                lookupResult?.postcode ?? draftFields.postcode,
                lookupResult?.city ?? draftFields.city,
              )}
              readOnly
              disabled
            />
            <input
              type="hidden"
              name="address"
              defaultValue={draftFields.address ?? ""}
            />
            <input
              type="hidden"
              name="postcode"
              defaultValue={draftFields.postcode ?? ""}
            />
            <input
              type="hidden"
              name="city"
              defaultValue={draftFields.city ?? ""}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.blockName}
              name="blockName"
              defaultValue={draftFields.blockName ?? ""}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.propertyDesignation}
              name="propertyDesignation"
              defaultValue={draftFields.propertyDesignation ?? ""}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.size + " (m²)"}
              name="size"
              type="number"
              min={0}
              defaultValue={draftFields.size ?? ""}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.architect}
              name="architect"
              defaultValue={draftFields.architect ?? ""}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.propertyOwner}
              name="propertyOwner"
              defaultValue={draftFields.propertyOwner ?? ""}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-grow">
              <Input
                label={dict.newFeatureForm.buildYear}
                name="buildYear"
                type="number"
                min={0}
                max={9999}
                defaultValue={draftFields.buildYear ?? ""}
              />
            </div>
            <div className="flex-grow">
              <Input
                label={dict.newFeatureForm.demolitionYear}
                name="demolitionYear"
                type="number"
                min={process.env.NEXT_PUBLIC_MIN_DEMOLITION_YEAR || 2016}
                max={9999}
                disabled={!isDemolished}
                required={isDemolished}
                defaultValue={draftFields.demolitionYear ?? ""}
              />
            </div>
          </div>
          <div>
            <TextArea
              label={dict.newFeatureForm.description}
              name="description"
              rows={3}
              defaultValue={draftFields.description ?? ""}
            />
          </div>
          <div>
            <TextArea
              label={dict.newFeatureForm.demolitionCause}
              name="demolitionCause"
              rows={3}
              required
              defaultValue={draftFields.demolitionCause ?? ""}
            />
          </div>
          <div>
            <TextArea
              label={dict.newFeatureForm.sources}
              name="sources"
              rows={3}
              defaultValue={draftFields.sources ?? ""}
            />
          </div>
          <div className="acan-text-body">
            <label
              htmlFor="privacyConsent"
              className="flex items-start gap-2 text-sm leading-snug"
            >
              <input
                id="privacyConsent"
                name="privacyConsent"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 accent-[#2637f3]"
              />
              <span>
                {dict.newFeatureForm.accept}{" "}
                <a
                  href="/policy-licensing-disclaimer.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Algemene voorwaarden
                </a>
                <span className="text-demolished"> *</span>
              </span>
            </label>
          </div>
          <div>
            <div className="mb-4 text-body first-letter:uppercase">
              {dict.newFeatureForm.sender}
            </div>
            <div className="flex w-full flex-col items-stretch justify-stretch gap-4 md:flex-row">
              <div className="flex-grow">
                <Input
                  label={dict.newFeatureForm.contributor}
                  name="contributor"
                  defaultValue={draftFields.contributor ?? ""}
                />
              </div>
              <div className="flex-grow">
                <Input
                  label={dict.newFeatureForm.email}
                  name="contributor-email"
                  type="email"
                  required
                  defaultValue={draftFields["contributor-email"] ?? ""}
                />
              </div>
            </div>
            <p className="mt-2 text-sm first-letter:uppercase">
              {dict.newFeatureForm.addEmail}
            </p>
          </div>
          <div className="flex gap-5 pb-[env(safe-area-inset-bottom)]">
            <Button type="button" onClick={onCancel}>
              {dict.newFeatureForm.cancel}
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={isSaving || !isFormValid}
            >
              {dict.newFeatureForm.save}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
