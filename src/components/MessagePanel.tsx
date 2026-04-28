import { FC, PropsWithChildren } from "react";
import { Button } from "./Button";
import { PortableText } from "@portabletext/react";

export const MessagePanel: FC<
  PropsWithChildren<
    MessageType & { onClose: () => void; dict: Dictionary; details?: string }
  >
> = ({ heading, body, onClose, dict, details }) => (
  <div className="flex flex-col justify-between">
    <div>
      <h2 className="acan-text-menu mb-4">{heading}</h2>
      <div className="acan-text-body prose">
        <PortableText value={body} />
        {details ? <p className="mt-4 text-demolished">{details}</p> : null}
      </div>
    </div>
    <div>
      <Button onClick={onClose} className="w-full">
        {dict.ariaLabels.close}
      </Button>
    </div>
  </div>
);
