import { FC, InputHTMLAttributes, useCallback, useState } from "react";
import classNames from "classnames";

export const Input: FC<
  Exclude<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "id" | "name" | "autoFocus"
  > & {
    name: string;
    label: string;
  }
> = ({ label, ...props }) => {
  const [interacted, setInteracted] = useState(false);

  const handleInteracted = useCallback(() => setInteracted(true), []);

  return (
    <div className="relative">
      <input
        {...props}
        id={props.name}
        className="peer w-full appearance-none border-b border-current bg-transparent outline-none focus-within:border-acan-blue"
        placeholder=" "
        onBlur={handleInteracted}
      />
      <label
        htmlFor={props.name}
        className={classNames(
          "absolute left-0 top-0 origin-top-left -translate-y-2 scale-50 text-body transition-transform peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-50",
          interacted && "peer-invalid:text-demolished",
        )}
      >
        {label}
        {props.required ? "*" : null}
      </label>
    </div>
  );
};
