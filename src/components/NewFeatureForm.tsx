import { capitalize } from "@/lib/capitalize";
import {
  ChangeEventHandler,
  DragEventHandler,
  FC,
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
import classNames from "classnames";

const ImageInput: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const processImages = useCallback((files: FileList) => {
    for (const file of files) {
      const fr = new FileReader();
      fr.onload = () => {
        const url = fr.result as string;
        setImages((old) => old.concat([url]));
        fr.onload = null;
      };

      fr.readAsDataURL(file);
    }
  }, []);
  const handleDrop: DragEventHandler<HTMLLabelElement> = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (inputRef.current) {
      const files = e.dataTransfer.files;
      inputRef.current.files = files;
      processImages(files);
    }
    setDragging(false);
  }, []);
  const handleDragEnter: DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(true);
    },
    [],
  );
  const handleDragExit: DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
    },
    [],
  );
  const handleUpload: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.files) processImages(e.target.files);
    },
    [],
  );

  const gridTemplateColumns = `repeat(${Math.ceil(
    Math.sqrt(images.length),
  )}, 1fr)`;
  console.log({ gridTemplateColumns });

  return (
    <label
      onDragOver={handleDragEnter}
      onDragLeave={handleDragExit}
      onDrop={handleDrop}
      className={classNames(
        "grid aspect-square w-full overflow-hidden border border-current",
        dragging && "border-acan-blue",
      )}
      style={{
        gridTemplateColumns,
      }}
      ref={labelRef}
    >
      <input
        type="file"
        name="images"
        multiple
        ref={inputRef}
        className="sr-only"
        onChange={handleUpload}
      />
      {images.map((img, i) => (
        <div key={i}>
          <img src={img} className="aspect-square w-full object-contain" />
        </div>
      ))}
    </label>
  );
};

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
    </div>
  );
};
