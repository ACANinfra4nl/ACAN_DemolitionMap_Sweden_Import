import { FC } from "react";

interface NewFeatureFormProps {
  latLng: LatLng;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

export const NewFeatureForm: FC<NewFeatureFormProps> = ({
  latLng,
  onCancel,
  onSubmit,
}) => (
  <form action={onSubmit} className="bg-white p-4">
    <input type="hidden" name="lat" value={latLng.lat} />
    <input type="hidden" name="lng" value={latLng.lng} />
    <div className="mb-4">
      <label htmlFor="image" className="block">
        Image
      </label>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/jpeg, image/png"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="name" className="block">
        Name
      </label>
      <input
        id="name"
        type="text"
        name="name"
        required
        autoComplete="false"
        className="border border-gray-200 w-full p-2"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows={10}
        required
        autoComplete="false"
        className="border border-gray-200 w-full p-2"
      ></textarea>
    </div>
    <div className="flex justify-between">
      <button
        onClick={onCancel}
        className="border-r-2 bg-black text-white px-4 py-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="border-r-2 bg-black text-white px-4 py-2"
      >
        Add
      </button>
    </div>
  </form>
);
