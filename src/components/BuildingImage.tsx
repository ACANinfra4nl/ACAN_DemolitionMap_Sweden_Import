"use client";
import classNames from "classnames";
import { FC } from "react";

export const BuildingImage: FC<Pick<FeatureBuilding, "images" | "state">> = ({
  images,
  state,
}) => (
  <div className="w-full ">
    {images && images.length > 0 ? (
      <img
        src={images[0]}
        className={classNames(
          "aspect-square w-full object-contain object-bottom",
          state === "riven" && "grayscale",
        )}
        loading="lazy"
      />
    ) : (
      <div className="aspect-square bg-acan-blue" />
    )}
  </div>
);
