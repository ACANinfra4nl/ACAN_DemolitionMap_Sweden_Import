import {
  ChangeEventHandler,
  DragEventHandler,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

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
  Pick<Dictionary, "ariaLabels"> & { text: string; maxSizeText: string }
> = ({ text, maxSizeText, ariaLabels }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isInvalidSize, setIsInvalidSize] = useState(false);
  const [dragging, setDragging] = useState(false);
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
  }, []);
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
    [],
  );
  const handleRemoveImage = useCallback((img: ImageType) => {
    setImages((old) => old.filter((i) => i !== img));
    if (inputRef.current && inputRef.current.files)
      inputRef.current.files = filterFileList(inputRef.current?.files, img);
  }, []);

  // NOTE: use effect here because we need to check the size of the images both when removing from images and when uploading new images
  useEffect(() => {
    if (images.length > 0) {
      const invalidSize =
        images.reduce((tot, curr) => tot + curr.file.size, 0) > 4e6;
      setIsInvalidSize(invalidSize);
      inputRef.current?.setCustomValidity(invalidSize ? maxSizeText : "");
    }
  }, [images]);

  return (
    <>
      <label
        onDragOver={handleDragEnter}
        onDragLeave={handleDragExit}
        onDrop={handleDrop}
        className={classNames(
          "flex aspect-wide w-full flex-wrap items-center justify-center gap-5 overflow-scroll border border-current p-5 focus-within:border-acan-blue",
          dragging && "border-acan-blue",
          isInvalidSize && "!border-demolished text-demolished",
        )}
        ref={labelRef}
      >
        <input
          type="file"
          name="images"
          multiple
          ref={inputRef}
          className="sr-only"
          onChange={handleUpload}
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
      </label>
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
