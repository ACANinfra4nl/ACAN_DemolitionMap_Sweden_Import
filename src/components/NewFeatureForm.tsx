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
import classNames from "classnames";

interface NewFeatureFormProps {
  latLng: LatLng;
  isSaving?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
}

export const NewFeatureForm = ({
  latLng,
  isSaving,
  onCancel,
  onSubmit,
}: NewFeatureFormProps) => {
  const panelEl = useRef<HTMLDivElement>(null);
  const [lookupResult, setLookupResult] = useState<ReverseGeocodeResult>();
  const [isDemolished, setIsDemolished] = useState(false);
  useClickOutside(panelEl, onCancel);
  useEffect(() => {
    // do reverse geocoding of latlng and populate address fields
    fetch(`/api/reverse?lat=${latLng.lat}&lng=${latLng.lng}`)
      .then((r) => r.json() as unknown as ReverseGeocodeResult)
      .then(setLookupResult);
    // focus first enabled input
    (
      panelEl.current?.querySelector(
        "form *:is(input, textarea, select):not([type=hidden], :disabled)",
      ) as HTMLElement | undefined
    )?.focus();
  }, []);

  const handleChangeState: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => setIsDemolished(e.currentTarget.value === "riven"),
    [],
  );

  useEffect(() => {
    // force wait cursor on the entire document
    document.body.classList.toggle("waiting", isSaving);
  }, [isSaving]);

  // throw new Error(
  //   "fixa så att cursor är progress på hela sidan när man sparar, fattar inte riktigt hur man ska göra, kanske med nån portal?",
  // );
  return (
    <div ref={panelEl}>
      <CloseButton onClick={onCancel} />
      <form onSubmit={onSubmit} autoComplete="off">
        <fieldset
          disabled={isSaving}
          className="flex flex-col gap-4 disabled:text-disabled"
        >
          <legend className="acan-text-menu mb-4">Lägg till byggnad</legend>
          <input type="hidden" name="lat" value={latLng.lat} />
          <input type="hidden" name="lng" value={latLng.lng} />
          <div>
            <ImageInput />
          </div>

          <div>
            <Select
              label="Kategori"
              name="category"
              options={categories}
              required
            />
          </div>
          <div>
            <Select
              label="Status"
              name="state"
              options={states}
              required
              onChange={handleChangeState}
            />
          </div>
          <div>
            <Input label="Byggnadens namn" name="buildingName" />
          </div>
          <div>
            <Input
              label="Adress"
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
            <Input label="Kvartersnamn" name="blockName" />
          </div>
          <div>
            <Input label="Fastighetsbeteckning" name="propertyDesignation" />
          </div>
          <div>
            <Input label="Storlek (m²)" name="size" type="number" min={0} />
          </div>
          <div>
            <Input label="Arkitekt" name="architect" />
          </div>
          <div>
            <Input label="Fastighetsägare" name="propertyOwner" />
          </div>
          <div className="flex gap-4">
            <div className="flex-grow">
              <Input
                label="Byggår"
                name="buildYear"
                type="number"
                min={0}
                max={9999}
              />
            </div>
            <div className="flex-grow">
              <Input
                label="Rivningsår"
                name="demolitionYear"
                type="number"
                min={process.env.NEXT_PUBLIC_MIN_DEMOLITION_YEAR || 2016}
                max={9999}
                disabled={!isDemolished}
              />
            </div>
          </div>
          <div>
            <TextArea
              label="Berättelser om byggnaden"
              name="description"
              rows={3}
              required
            />
          </div>
          <div>
            <TextArea
              label="Bakgrund till rivning (ange gärna källa)"
              name="demolitionCause"
              rows={3}
              required
            />
          </div>
          <div>
            <TextArea label="Bildkällor" name="sources" rows={3} />
          </div>
          <div>
            <div className="mb-4 text-body">Avsändare</div>
            <div className="flex w-full flex-col items-stretch justify-stretch gap-4 md:flex-row">
              <div className="flex-grow">
                <Input label="Namn" name="contributor" />
              </div>
              <div className="flex-grow">
                <Input
                  label="E-post"
                  name="contributor-email"
                  type="email"
                  required
                />
              </div>
            </div>
            <p className="mt-2 text-sm">
              Ange din e-post-adress om du vill få en notis när ditt bidrag
              granskats.
            </p>
          </div>
          <div className="hidden" aria-hidden>
            <label htmlFor="accept">Jag accepterar villkoren</label>
            <input type="checkbox" name="accept" id="accept" />
          </div>
          <div className="flex gap-5">
            <Button onClick={onCancel}>Avbryt</Button>
            <Button type="submit" className="w-full">
              Spara
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
