import { Image as SanityImage } from "sanity";
import { urlForImage } from "../../../sanity/lib/image";

export const Image = ({ value }: { value: SanityImage }) => (
  <img src={urlForImage(value).url()} role="presentation" className="w-full" />
);
