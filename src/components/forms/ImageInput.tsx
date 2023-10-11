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
  const [images, setImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const processImages = useCallback((files: FileList) => {
    for (const file of files) {
      const fr = new FileReader();
      fr.onload = () => {
        const url = fr.result as string;
        setImages((old) => old.concat([url]));
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

  const gridTemplateColumns = `repeat(${Math.ceil(
    Math.sqrt(images.length),
  )}, 1fr)`;
  console.log({ gridTemplateColumns });

  return (
    <label
      onDragOver={handleDragEnter}
      onDragLeave={handleDragExit}
      onDrop={handleDrop}
      className={classNames(
        "grid aspect-square w-full overflow-hidden border border-current",
        dragging && "border-acan-blue",
      )}
      style={{
        gridTemplateColumns,
      }}
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
      {images.map((img, i) => (
        <div key={i}>
          <img src={img} className="aspect-square w-full object-contain" />
        </div>
      ))}
    </label>
  );
};
