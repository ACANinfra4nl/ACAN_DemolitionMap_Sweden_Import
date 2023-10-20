import {
  FC,
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CloseButton } from "./CloseButton";
import { Carousel } from "./Carousel";
import { BuildingHeading } from "./BuildingHeading";
import { DetailsTable } from "./DetailsTable";
import { ShareButton } from "./ShareButton";
import { Transition } from "@headlessui/react";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { Image } from "./Image";
import { Linkify } from "./Linkify";

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
      <div className="z-10 col-start-1 row-start-1 ml-6 mt-6">
        <CloseButton onClick={onClose} />
      </div>

      {properties.images && properties.images.map && (
        <div className="col-start-1 row-span-2 row-start-1 mb-2">
          <Carousel>
            {properties.images.map((image) => (
              <Image
                key={image.asset.url}
                image={image}
                alt=""
                className="aspect-video w-full snap-start object-cover"
                width={image.asset.metadata.dimensions.width}
                height={image.asset.metadata.dimensions.height}
              />
            ))}
          </Carousel>
        </div>
      )}

      <div className="min-w-0">
        <BuildingHeading building={properties} />
        <DetailsTable building={properties} />
        <div className="prose text-body">
          {properties.description && (
            <p>
              Berättelser om byggnaden:{" "}
              <Linkify>{properties.description}</Linkify>
            </p>
          )}
          {properties.demolitionCause && (
            <p>
              Rivningsorsak: <Linkify>{properties.demolitionCause}</Linkify>
            </p>
          )}
        </div>
        <div className="mt-8 flex gap-4">
          <ShareButton
            onSuccess={handleShareSuccess}
            onError={handleShareError}
            disabled={shareSuccessState !== undefined}
          >
            Dela
          </ShareButton>
          <Transition
            show={shareSuccessState === "clipboard"}
            enter="transition-all"
            enterFrom="translate-y-4 opacity-0"
            enterTo="transform-none opacity-100"
            leave="transition-all"
            leaveFrom="transform-none opacity-100"
            leaveTo="translate-y-4 opacity-0"
            className="text-body text-saved"
          >
            Länk kopierad
          </Transition>
          <Transition
            show={shareSuccessState === false}
            enter="transition-all"
            enterFrom="translate-y-4 opacity-0"
            enterTo="transform-none opacity-100"
            leave="transition-all"
            leaveFrom="transform-none opacity-100"
            leaveTo="translate-y-4 opacity-0"
            className="text-body text-demolished"
          >
            Delningen misslyckades
          </Transition>
        </div>
      </div>
    </div>
  );
};
