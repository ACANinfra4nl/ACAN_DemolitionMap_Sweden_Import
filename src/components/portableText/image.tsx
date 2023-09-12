import { Image } from "sanity";
import { urlForImage } from "../../../sanity/lib/image";

export const image = ({ value }: { value: Image }) => (
  <img src={urlForImage(value).url()} role="presentation" className="w-full" />
);
