import { capitalize } from "@/lib/capitalize";
import { useEffect, useState } from "react";
import { CloseButton } from "./CloseButton";

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
    <div className="bg-white p-4">
      <div className="text-right mb-4">
        <CloseButton onClick={onCancel} />
      </div>
      <form action={onSubmit}>
        <input type="hidden" name="lat" value={latLng.lat} />
        <input type="hidden" name="lng" value={latLng.lng} />
        <div className="mb-4">
          <label htmlFor="category" className="block">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            required
            className="border border-gray-200 w-full px-2 py-2 capitalize"
          >
            <option value=""></option>
            {[
              "bostad",
              "kontor",
              "kommersiell",
              "samhällsfastighet",
              "industri",
              "övrig",
            ].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="state" className="block">
            Status
          </label>
          <select
            name="state"
            id="state"
            required
            className="border border-gray-200 w-full px-2 py-2 capitalize"
          >
            <option value=""></option>
            {["hotad", "riven", "räddad"].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block">
            Gatuadress
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="border border-gray-200 w-full px-2 py-2"
            defaultValue={lookupResult ? lookupResult.address : undefined}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postcode" className="block">
            Postnummer och postort
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="postcode"
              name="postcode"
              className="border border-gray-200 w-1/4 max-w-xs px-2 py-2"
              defaultValue={lookupResult ? lookupResult.postcode : undefined}
            />
            <input
              type="text"
              id="city"
              name="city"
              className="border border-gray-200 flex-grow px-2 py-2"
              defaultValue={lookupResult ? lookupResult.city : undefined}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="blockName" className="block">
            Kvartersnamn
          </label>
          <input
            type="text"
            name="blockName"
            id="blockName"
            className="border border-gray-200 w-full px-2 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="propertyDesignation" className="block">
            Fastighetsbeteckning
          </label>
          <input
            type="text"
            name="propertyDesignation"
            id="propertyDesignation"
            className="border border-gray-200 w-full px-2 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="size" className="block">
            Storlek (m<sup>2</sup>)
          </label>
          <input
            type="number"
            name="size"
            id="size"
            className="border border-gray-200 w-full px-2 py-2"
            min={0}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="boundCO2" className="block">
            Inbunden CO<sub>2</sub> (ton)
          </label>
          <input
            type="number"
            name="boundCO2"
            id="boundCO2"
            className="border border-gray-200 w-full px-2 py-2"
            min={0}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="architect" className="block">
            Arkitekt
          </label>
          <input
            type="text"
            name="architect"
            id="architect"
            className="border border-gray-200 w-full px-2 py-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="propertyOwner" className="block">
            Fastighetsägare
          </label>
          <input
            type="text"
            name="propertyOwner"
            id="propertyOwner"
            className="border border-gray-200 w-full px-2 py-2"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-grow">
            <label htmlFor="buildYear" className="block">
              Byggår
            </label>
            <input
              type="number"
              name="buildYear"
              id="buildYear"
              required
              min={0}
              max={9999}
              className="border border-gray-200 w-full px-2 py-2"
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="demolitionYear" className="block">
              Rivningsår
            </label>
            <input
              type="number"
              name="demolitionYear"
              id="demolitionYear"
              required
              min={0}
              max={9999}
              className="border border-gray-200 w-full px-2 py-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="images" className="block">
            Bilder
          </label>
          <input
            type="file"
            name="images"
            id="images"
            accept="image/jpeg, image/png"
            multiple
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block">
            Arkitektur
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            autoComplete="false"
            className="border border-gray-200 w-full px-2 py-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="demolitionCause" className="block">
            Rivningsorsak
          </label>
          <textarea
            id="demolitionCause"
            name="demolitionCause"
            rows={4}
            autoComplete="false"
            className="border border-gray-200 w-full px-2 py-2"
          ></textarea>
        </div>
        <div className="hidden" aria-hidden>
          <label htmlFor="accept">Jag accepterar villkoren</label>
          <input type="checkbox" name="accept" id="accept" />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="border-r-2 bg-black text-white px-4 py-2"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="border-r-2 bg-black text-white px-4 py-2"
          >
            Spara
          </button>
        </div>
      </form>
    </div>
  );
};
