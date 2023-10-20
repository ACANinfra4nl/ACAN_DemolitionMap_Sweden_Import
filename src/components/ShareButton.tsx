import { FC, PropsWithChildren, useCallback } from "react";

interface ShareButtonProps {
  disabled?: boolean;
  onSuccess: (type: "share" | "clipboard") => void;
  onError: (reason: any) => void;
}

export const ShareButton: FC<PropsWithChildren<ShareButtonProps>> = ({
  disabled,
  children,
  onSuccess,
  onError,
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
      className="text-body underline hover:text-acan-blue focus-visible:text-acan-blue"
      disabled={disabled}
    >
      {children}
    </button>
  );
};
