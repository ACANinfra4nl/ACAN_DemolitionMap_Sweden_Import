import { FC, ReactNode, useCallback, useRef, useState } from "react";
import { CloseButton } from "./CloseButton";
import { Carousel } from "./Carousel";
import { BuildingHeading } from "./BuildingHeading";
import { DetailsTable } from "./DetailsTable";
import { ShareButton } from "./ShareButton";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { Image } from "./Image";
import { Linkify } from "./Linkify";
import { formatAddress } from "@/lib/formatAddress";
import Link from "next/link";

const Detail: FC<{ label: string; value: string | number | ReactNode }> = ({
  label,
  value,
}) => (
  <>
    <div>{label}</div>
    <div className="text-right font-bold">{value}</div>
  </>
);

interface DetailsProps {
  properties: FeatureBuilding;
  onClose: () => void;
}

export const DetailsPanel: FC<DetailsProps> = ({ properties, onClose }) => {
  const panelEl = useRef<HTMLDivElement>(null);
  const [shareSuccessState, setShareSuccessState] = useState<
    string | false | undefined
  >();
  useClickOutside(panelEl, onClose);

  const handleShareSuccess = useCallback((type: string) => {
    setShareSuccessState(type);
    setTimeout(setShareSuccessState, 2000, undefined);
  }, []);
  const handleShareError = useCallback((reason: any) => {
    if (reason instanceof DOMException && reason.name === "AbortError") return;
    setShareSuccessState(false);
    setTimeout(setShareSuccessState, 2000, undefined);
  }, []);

  return (
    <div className="grid grid-rows-[auto_auto_1fr] p-5" ref={panelEl}>
      <div className="z-10 col-start-1 row-start-1 flex justify-end">
        <CloseButton onClick={onClose} />
      </div>

      <div className="col-start-1 row-span-2 row-start-1 mb-2">
        {properties.images && properties.images.map ? (
          <Carousel>
            {properties.images.map((image) => (
              <Image
                key={image.asset.url}
                image={image}
                alt=""
                className="aspect-video w-full min-w-full snap-start object-cover"
                width={image.asset.metadata.dimensions.width}
                height={image.asset.metadata.dimensions.height}
              />
            ))}
          </Carousel>
        ) : (
          <div className="aspect-wide bg-acan-blue" />
        )}
      </div>

      <div className="min-w-0">
        <BuildingHeading building={properties} showYear />
        <DetailsTable building={properties} />
        <div className="prose text-body font-normal">
          {properties.description && (
            <p className="whitespace-pre-line break-words">
              <span className="font-bold">Berättelser om byggnaden:</span>{" "}
              <Linkify>{properties.description}</Linkify>
            </p>
          )}
          {properties.demolitionCause && (
            <p className="whitespace-pre-line break-words">
              <span className="font-bold">Anledning till rivning:</span>{" "}
              <Linkify>{properties.demolitionCause}</Linkify>
            </p>
          )}
          {properties.sources && (
            <p className="whitespace-pre-line break-words">
              <span className="font-bold">Bildkällor:</span>{" "}
              <Linkify>{properties.sources}</Linkify>
            </p>
          )}
        </div>
        <div className="mt-8 flex justify-between gap-4">
          <ShareButton
            onSuccess={handleShareSuccess}
            onError={handleShareError}
            state={shareSuccessState}
          >
            Dela
          </ShareButton>
          <Link
            href={`mailto:rivningskartan@architectscan.se?subject=${encodeURIComponent(
              `Berättelse om ${formatAddress(
                properties.address,
                properties.postcode,
                properties.city,
              )}`,
            )}`}
            className="text-body underline hover:text-acan-blue focus-visible:text-acan-blue"
          >
            Lägg till berättelse
          </Link>
        </div>
      </div>
    </div>
  );
};
