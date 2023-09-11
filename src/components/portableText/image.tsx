import { Image } from "sanity";
import { urlForImage } from "../../../sanity/lib/image";

export const image = ({ value }: { value: Image }) => (
  <div className="my-4">
    <img
      src={urlForImage(value).url()}
      role="presentation"
      className="w-full"
    />
  </div>
);
