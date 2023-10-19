import {
  ChangeEventHandler,
  DragEventHandler,
  FC,
  useCallback,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

export const ImageInput: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const processImages = useCallback((files: FileList) => {
    for (const file of files) {
      const fr = new FileReader();
      fr.onload = () => {
        const url = fr.result as string;
        setImages((old) => old.concat([{ name: file.name, url }]));
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

  return (
    <label
      onDragOver={handleDragEnter}
      onDragLeave={handleDragExit}
      onDrop={handleDrop}
      className={classNames(
        "aspect-wide flex w-full flex-wrap items-center justify-center gap-5 overflow-scroll border border-current p-5",
        dragging && "border-acan-blue",
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
          <figure key={i} className="flex-grow basis-1/4">
            <img
              src={img.url}
              className="aspect-square w-full object-contain"
            />
            <figcaption className="text-sm">{img.name}</figcaption>
          </figure>
        ))
      ) : (
        <span className="acan-text-body">
          Dra och släpp dina bilder här för att ladda upp
        </span>
      )}
    </label>
  );
};
