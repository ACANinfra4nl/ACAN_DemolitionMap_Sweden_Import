import {
  ChangeEventHandler,
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

interface NewFeatureFormProps {
  latLng: LatLng;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export const NewFeatureForm = ({
  latLng,
  onCancel,
  onSubmit,
}: NewFeatureFormProps) => {
  const panelEl = useRef<HTMLDivElement>(null);
  const [lookupResult, setLookupResult] = useState<ReverseGeocodeResult>();
  const [isDemolished, setIsDemolished] = useState(false);
  useEffect(() => {
    // do reverse geocoding of latlng and populate address fields
    fetch(`/api/reverse?lat=${latLng.lat}&lng=${latLng.lng}`)
      .then((r) => r.json() as unknown as ReverseGeocodeResult)
      .then(setLookupResult);
  }, []);
  useClickOutside(panelEl, onCancel);

  const handleChangeState: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => setIsDemolished(e.currentTarget.value === "riven"),
    [],
  );

  return (
    <div ref={panelEl}>
      <CloseButton onClick={onCancel} />
      <div>
        <h2 className="text-menu-s uppercase sm:text-menu">
          Lägg till byggnad
        </h2>
      </div>
      <form
        action={onSubmit}
        autoComplete="off"
        className="flex flex-col gap-4"
      >
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
            autoFocus
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
          <input type="hidden" name="city" defaultValue={lookupResult?.city} />
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
              min={0}
              max={9999}
              disabled={!isDemolished}
            />
          </div>
        </div>
        <div>
          <TextArea
            label="Berättelser om byggnaden"
            name="description"
            rows={4}
          />
        </div>
        <div>
          <TextArea
            label="Bakgrund till rivning"
            name="demolitionCause"
            rows={4}
          />
        </div>
        <div>
          <TextArea label="Källor (t.ex. bildkälla)" name="sources" rows={4} />
        </div>
        <fieldset>
          <legend className="mb-4 text-body">Avsändare</legend>
          <div className="flex w-full flex-col items-stretch justify-stretch gap-4 md:flex-row">
            <div className="flex-grow">
              <Input label="Namn" name="contributor" />
            </div>
            <div className="flex-grow">
              <Input label="E-post" name="contributor-email" type="email" />
            </div>
          </div>
          <p className="mt-2 text-sm">
            Ange din e-post-adress om du vill få en notis när ditt bidrag
            granskats.
          </p>
        </fieldset>
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
      </form>
    </div>
  );
};
