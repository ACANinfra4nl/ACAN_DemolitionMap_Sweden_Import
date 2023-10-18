"use client";
import classNames from "classnames";
import { ComponentProps, FC } from "react";
import { Image } from "./Image";

export const BuildingImage: FC<
  Pick<FeatureBuilding, "images" | "state"> &
    Pick<ComponentProps<typeof Image>, "sizes">
> = ({ images, state, sizes }) => (
  <div className="w-full ">
    {images && images.length > 0 ? (
      <Image
        image={images[0]}
        className={classNames(
          "aspect-square h-auto w-full object-contain object-bottom",
          state === "riven" && "grayscale",
        )}
        loading="lazy"
        alt=""
        width={images[0].asset.metadata.dimensions.width}
        height={images[0].asset.metadata.dimensions.height}
        sizes={sizes}
      />
    ) : (
      <div className="aspect-square bg-acan-blue" />
    )}
  </div>
);
