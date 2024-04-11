import classNames from "classnames";
import { FC, PropsWithChildren, useCallback } from "react";

interface ShareButtonProps {
  state: string | boolean | undefined;
  onSuccess: (type: "share" | "clipboard") => void;
  onError: (reason: any) => void;
  content: DetailsPanel;
}

export const ShareButton: FC<PropsWithChildren<ShareButtonProps>> = ({
  state,
  children,
  onSuccess,
  onError,
  content,
}) => {
  const handleShare = useCallback(() => {
    if (typeof navigator.share === "function") {
      navigator
        .share({ url: document.location.href })
        .then(() => onSuccess("share"))
        .catch(onError);
    } else {
      // no share api, copy link
      navigator.clipboard
        .writeText(document.location.href)
        .then(() => onSuccess("clipboard"))
        .catch(onError);
    }
  }, []);
  return (
    <button
      onClick={handleShare}
      className={classNames(
        "text-body first-letter:uppercase hover:text-acan-blue focus-visible:text-acan-blue",
        state === undefined && "underline",
      )}
      disabled={state !== undefined}
    >
      {state === "clipboard" ? (
        <span className="text-saved first-letter:uppercase">
          {content.linkCopied}
        </span>
      ) : state === false ? (
        <span className="text-demolished first-letter:uppercase">
          {content.shareFailed}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
