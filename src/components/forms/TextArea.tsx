import classNames from "classnames";
import { FC, TextareaHTMLAttributes, useCallback, useState } from "react";

export const TextArea: FC<
  Exclude<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name"> & {
    name: string;
    label: string;
  }
> = ({ label, ...props }) => {
  const [interacted, setInteracted] = useState(false);
  const handleInteracted = useCallback(() => setInteracted(true), []);
  return (
    <div className="relative">
      <textarea
        id={props.name}
        {...props}
        className="peer block w-full border border-current bg-white p-4 outline-none focus-visible:border-acan-blue"
        placeholder=" "
        onBlur={handleInteracted}
      ></textarea>
      <label
        htmlFor={props.name}
        className={classNames(
          "absolute left-4 top-4 origin-top-left -translate-y-2 scale-50 text-body transition-transform first-letter:uppercase peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-50",
          interacted && "peer-invalid:text-demolished",
        )}
      >
        {label}
        {props.required ? "*" : null}
      </label>
    </div>
  );
};
