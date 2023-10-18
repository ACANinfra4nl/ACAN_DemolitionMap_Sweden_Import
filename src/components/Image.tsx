import Img from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { ComponentProps, FC } from "react";
import { client } from "@/lib/sanityClient";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

type ImageProps = {
  image: SanityImageSource;
} & Omit<ComponentProps<typeof Img>, "src">;

export const Image: FC<ImageProps> = ({ image, ...props }) => {
  const imageProps = useNextSanityImage(client, image);
  return <Img {...imageProps} {...props} />;
};
