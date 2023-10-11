import { capitalize } from "@/lib/capitalize";
import { useEffect, useState } from "react";
import { CloseButton } from "./CloseButton";
import { categories } from "@/lib/categories";
import { states } from "@/lib/states";
import { Input } from "./forms/Input";
import { Select } from "./forms/Select";
import { TextArea } from "./forms/TextArea";
import { formatAddress } from "../lib/formatAddress";
import { ImageInput } from "./forms/ImageInput";

interface NewFeatureFormProps {
  latLng: LatLng;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

export const NewFeatureForm = ({
  latLng,
  onCancel,
  onSubmit,
}: NewFeatureFormProps) => {
  const [lookupResult, setLookupResult] = useState<ReverseGeocodeResult>();
  useEffect(() => {
    // do reverse geocoding of latlng and populate address fields
    fetch(`/api/reverse?lat=${latLng.lat}&lng=${latLng.lng}`)
      .then((r) => r.json() as unknown as ReverseGeocodeResult)
      .then(setLookupResult);
  }, []);
  // TODO: if user changes address, do a forward geocoding lookup?
  return (
    <>
      <CloseButton onClick={onCancel} />
      <div className="mb-4">
        <h2 className="text-menu-s uppercase sm:text-menu">
          Lägg till byggnad
        </h2>
      </div>
      <form action={onSubmit}>
        <input type="hidden" name="lat" value={latLng.lat} />
        <input type="hidden" name="lng" value={latLng.lng} />
        <div className="mb-4">
          <ImageInput />
        </div>
        <div className="mb-4">
          <Select
            label="Kategori"
            name="category"
            options={categories}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <Select label="Status" name="state" options={states} required />
        </div>
        <div className="mb-4">
          <Input
            label="Adress"
            name=""
            value={formatAddress(
              lookupResult?.address,
              lookupResult?.postcode,
              lookupResult?.city,
            )}
            readOnly
            disabled
          />
          <input type="hidden" name="address" value={lookupResult?.address} />
          <input type="hidden" name="postcode" value={lookupResult?.postcode} />
          <input type="hidden" name="city" value={lookupResult?.city} />
        </div>
        <div className="mb-4">
          <Input label="Kvartersnamn" name="blockName" />
        </div>
        <div className="mb-4">
          <Input label="Fastighetsbeteckning" name="propertyDesignation" />
        </div>
        <div className="mb-4">
          <Input label="Storlek (m²)" name="size" type="number" min={0} />
        </div>
        <div className="mb-4">
          <Input label="Arkitekt" name="architect" />
        </div>
        <div className="mb-4">
          <Input label="Fastighetsägare" name="propertyOwner" />
        </div>
        <div className="mb-4 flex gap-4">
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
            />
          </div>
        </div>
        <div className="mb-4">
          <TextArea label="Arkitektur" name="description" rows={4} />
        </div>
        <div className="mb-4">
          <TextArea label="Rivningsorsak" name="demolitionCause" rows={4} />
        </div>
        <div className="hidden" aria-hidden>
          <label htmlFor="accept">Jag accepterar villkoren</label>
          <input type="checkbox" name="accept" id="accept" />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="border-r-2 bg-black px-4 py-2 text-white outline-none focus-within:bg-acan-blue"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="border-r-2 bg-black px-4 py-2 text-white outline-none focus-within:bg-acan-blue"
          >
            Spara
          </button>
        </div>
      </form>
    </>
  );
};
