import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
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
import { useClickOutside } from "@/app/hooks/useClickOutside";
import classNames from "clsx";

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
  const [lookupResult, setLookupResult] = useState<ReverseGeocodeResult>();
  const [isDemolished, setIsDemolished] = useState(false);
  useClickOutside(panelEl, onCancel);
  useEffect(() => {
    const controller = new AbortController();

    // do reverse geocoding of latlng and populate address fields
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
    // focus first enabled input
    (
      panelEl.current?.querySelector(
        "form *:is(input, textarea, select):not([type=hidden], :disabled)",
      ) as HTMLElement | undefined
    )?.focus();
    return () => {
      controller.abort();
      document.body.classList.remove("waiting");
    };
  }, []);

  const handleChangeState: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => setIsDemolished(e.currentTarget.value === "riven"),
    [],
  );

  // throw new Error(
  //   "fixa så att cursor är progress på hela sidan när man sparar, fattar inte riktigt hur man ska göra, kanske med nån portal?",
  // );
  return (
    <div ref={panelEl}>
      <CloseButton onClick={onCancel} close={dict.ariaLabels.close} />
      <form onSubmit={onSubmit} autoComplete="off">
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
              text={dict.newFeatureForm.imageInput}
              maxSizeText={dict.newFeatureForm.imageMaxSize}
              ariaLabels={dict.ariaLabels}
            />
          </div>

          <div>
            <Select
              label={dict.newFeatureForm.category}
              name="category"
              options={categories}
              required
              formList={dict.categories}
            />
          </div>
          <div>
            <Select
              label={dict.newFeatureForm.state}
              name="state"
              options={states}
              required
              onChange={handleChangeState}
              formList={dict.states}
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.buildingName}
              name="buildingName"
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.address}
              name=""
              defaultValue={formatAddress(
                lookupResult?.address,
                lookupResult?.postcode,
                lookupResult?.city,
              )}
              readOnly
              disabled
            />
            <input
              type="hidden"
              name="address"
              defaultValue={lookupResult?.address}
            />
            <input
              type="hidden"
              name="postcode"
              defaultValue={lookupResult?.postcode}
            />
            <input
              type="hidden"
              name="city"
              defaultValue={lookupResult?.city}
            />
          </div>
          <div>
            <Input label={dict.newFeatureForm.blockName} name="blockName" />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.propertyDesignation}
              name="propertyDesignation"
            />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.size + " (m²)"}
              name="size"
              type="number"
              min={0}
            />
          </div>
          <div>
            <Input label={dict.newFeatureForm.architect} name="architect" />
          </div>
          <div>
            <Input
              label={dict.newFeatureForm.propertyOwner}
              name="propertyOwner"
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
              />
            </div>
          </div>
          <div>
            <TextArea
              label={dict.newFeatureForm.description}
              name="description"
              rows={3}
            />
          </div>
          <div>
            <TextArea
              label={dict.newFeatureForm.demolitionCause}
              name="demolitionCause"
              rows={3}
              required
            />
          </div>
          <div>
            <TextArea
              label={dict.newFeatureForm.sources}
              name="sources"
              rows={3}
            />
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
                />
              </div>
              <div className="flex-grow">
                <Input
                  label={dict.newFeatureForm.email}
                  name="contributor-email"
                  type="email"
                  required
                />
              </div>
            </div>
            <p className="mt-2 text-sm first-letter:uppercase">
              {dict.newFeatureForm.addEmail}
            </p>
          </div>
          <div className="hidden" aria-hidden>
            <label className="first-letter:uppercase" htmlFor="accept">
              {dict.newFeatureForm.accept}
            </label>
            <input type="checkbox" name="accept" id="accept" />
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
                className="mt-1"
              />
              <span>
                {dict.newFeatureForm.accept}{" "}
                <a
                  href="/policy-licensing-disclaimer.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Policy, Licensing & Disclaimer
                </a>
                <span className="text-demolished"> *</span>
              </span>
            </label>
          </div>
          <div className="flex gap-5">
            <Button onClick={onCancel}>{dict.newFeatureForm.cancel}</Button>
            <Button type="submit" className="w-full">
              {dict.newFeatureForm.save}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
