import {
  ChangeEventHandler,
  FC,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";

export const Select: FC<
  Exclude<
    InputHTMLAttributes<HTMLSelectElement>,
    "className" | "id" | "name" | "autoFocus"
  > & {
    name: string;
    label: string;
    options: string[];
  }
> = ({ label, onChange, autoFocus, options, ...props }) => {
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
        className="peer w-full appearance-none border-b border-current text-body capitalize outline-none focus-within:border-acan-blue"
        onChange={handleChange}
        onBlur={handleInteracted}
      >
        <option></option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <label
        htmlFor={props.name}
        className={classNames(
          "absolute left-0 top-0 origin-top-left text-body transition-transform peer-focus:-translate-y-2 peer-focus:scale-50",
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
