import {
  ChangeEventHandler,
  DragEventHandler,
  FC,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import classNames from "clsx";

interface ImageType {
  name: string;
  url: string;
  file: File;
}

const filterFileList = (files: FileList, img: ImageType): FileList => {
  const dataTransfer = new DataTransfer();
  for (const f of files) if (f !== img.file) dataTransfer.items.add(f);
  return dataTransfer.files;
};

export const ImageInput: FC<
  Pick<Dictionary, "ariaLabels"> & {
    label: string;
    text: string;
    maxSizeText: string;
    required?: boolean;
    requiredMessage?: string;
    onValidityChange?: () => void;
    onImagesCountChange?: (count: number) => void;
  }
> = ({
  label,
  text,
  maxSizeText,
  ariaLabels,
  required,
  requiredMessage,
  onValidityChange,
  onImagesCountChange,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isInvalidSize, setIsInvalidSize] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const processImages = useCallback((files: FileList) => {
    for (const file of files) {
      const fr = new FileReader();
      fr.onload = () => {
        const url = fr.result as string;
        setImages((old) => old.concat([{ name: file.name, url, file }]));
        fr.onload = null;
      };

      fr.readAsDataURL(file);
    }
  }, []);
  const handleDrop: DragEventHandler<HTMLLabelElement> = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (inputRef.current) {
      const files = e.dataTransfer.files;
      inputRef.current.files = files;
      processImages(files);
    }
    setDragging(false);
  }, [processImages]);
  const handleDragEnter: DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(true);
    },
    [],
  );
  const handleDragExit: DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
    },
    [],
  );
  const handleUpload: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.files) processImages(e.target.files);
    },
    [processImages],
  );
  const handleRemoveImage = useCallback((img: ImageType) => {
    setImages((old) => old.filter((i) => i !== img));
    if (inputRef.current && inputRef.current.files)
      inputRef.current.files = filterFileList(inputRef.current?.files, img);
  }, []);

  const invalidEmpty =
    Boolean(required) && images.length === 0 && !isInvalidSize;
  const invalidEmptyVisual = interacted && invalidEmpty;

  // Sync native validity (submit + checkValidity) and size error state whenever files change.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (images.length > 0) {
      const invalidSize =
        images.reduce((tot, curr) => tot + curr.file.size, 0) > 4e6;
      setIsInvalidSize(invalidSize);
      el.setCustomValidity(invalidSize ? maxSizeText : "");
    } else {
      setIsInvalidSize(false);
      el.setCustomValidity(
        required && requiredMessage ? requiredMessage : "",
      );
    }
    onValidityChange?.();
    onImagesCountChange?.(images.length);
  }, [
    images,
    maxSizeText,
    onImagesCountChange,
    onValidityChange,
    required,
    requiredMessage,
  ]);

  return (
    <>
      <label htmlFor={inputId} className="flex cursor-pointer flex-col gap-2">
        <span
          className={classNames(
            "text-body first-letter:uppercase",
            invalidEmptyVisual && "text-demolished",
          )}
        >
          {label}
          {required ? <span className="text-demolished">*</span> : null}
        </span>
        <span
          onDragOver={handleDragEnter}
          onDragLeave={handleDragExit}
          onDrop={handleDrop}
          className={classNames(
            "flex aspect-wide w-full flex-wrap items-center justify-center gap-5 overflow-scroll border border-current p-5 focus-within:border-acan-blue",
            dragging && "border-acan-blue",
            (isInvalidSize || invalidEmptyVisual) &&
              "!border-demolished text-demolished",
          )}
        >
          <input
            id={inputId}
            type="file"
            name="images"
            multiple
            ref={inputRef}
            className="sr-only"
            onChange={handleUpload}
            onBlur={() => setInteracted(true)}
          />
          {images.length > 0 ? (
            images.map((img, i) => (
              <figure key={i} className="relative flex-grow basis-1/4">
                <img
                  src={img.url}
                  className="aspect-square w-full object-contain"
                />
                <div className="flex justify-between gap-2">
                  <figcaption className="text-sm">{img.name}</figcaption>
                  <button
                    onClick={(e) => {
                      handleRemoveImage(img);
                      e.preventDefault();
                    }}
                    aria-label={`${ariaLabels.remove} ${img.name}`}
                    className="p-2 text-body leading-none hover:text-acan-blue focus-visible:text-acan-blue"
                  >
                    &times;
                  </button>
                </div>
              </figure>
            ))
          ) : (
            <span className="acan-text-body first-letter:uppercase">{text}</span>
          )}
        </span>
      </label>
      {invalidEmptyVisual && requiredMessage ? (
        <p className="mt-2 text-sm text-demolished first-letter:uppercase">
          {requiredMessage}
        </p>
      ) : null}
      <p
        className={classNames(
          "mt-2 text-sm first-letter:uppercase",
          isInvalidSize && "text-demolished",
        )}
      >
        {maxSizeText}
      </p>
    </>
  );
};
