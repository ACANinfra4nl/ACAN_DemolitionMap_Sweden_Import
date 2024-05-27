import {
  ChangeEventHandler,
  FC,
  InputHTMLAttributes,
  useCallback,
  useState,
} from "react";
import classNames from "classnames";
import { TitledListValue } from "sanity";
import { capitalize } from "@/lib/capitalize";

export const Select: FC<
  Exclude<
    InputHTMLAttributes<HTMLSelectElement>,
    "className" | "id" | "name" | "autoFocus"
  > & {
    name: string;
    label: string;
    options: TitledListValue<string>[];
    formList: Categories | States;
  }
> = ({ label, onChange, autoFocus, options, formList, ...props }) => {
  const [hasValue, setHasValue] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const handleChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    },
    [],
  );
  const handleInteracted = useCallback(() => setInteracted(true), []);

  return (
    <div className="relative">
      <select
        {...props}
        id={props.name}
        className="peer w-full appearance-none border-b border-current text-body outline-none first-letter:uppercase focus-within:border-acan-blue"
        onChange={handleChange}
        onBlur={handleInteracted}
      >
        <option></option>

        {options.map((opt, i) => (
          <option
            className="capitalize"
            key={opt.title}
            value={opt.value ?? ""}
          >
            {capitalize(formList[opt.title as keyof typeof formList])}
          </option>
        ))}
      </select>
      <label
        htmlFor={props.name}
        className={classNames(
          "absolute left-0 top-0 origin-top-left text-body transition-transform first-letter:uppercase peer-focus:-translate-y-2 peer-focus:scale-50",
          hasValue && "-translate-y-2 scale-50",
          interacted && "peer-invalid:text-demolished",
        )}
      >
        {label}
        {props.required ? "*" : null}
      </label>
    </div>
  );
};
