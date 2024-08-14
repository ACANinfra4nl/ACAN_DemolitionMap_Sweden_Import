import {
  FC,
  FocusEvent,
  FocusEventHandler,
  InputHTMLAttributes,
  useCallback,
  useState,
} from "react";
import classNames from "clsx";

export const Input: FC<
  Exclude<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "id" | "name" | "autoFocus" | "onChange"
  > & {
    name: string;
    label: string;
    onChange?: <T>(event: { target: { value: T } }) => void;
  }
> = ({ label, ...props }) => {
  const [interacted, setInteracted] = useState(false);

  const handleInteracted = useCallback(() => setInteracted(true), []);
  const handleFocus = props.min
    ? useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
          // if there's a min value and the input is empty, set it to the min value
          if (props.min && !props.value && !e.target.value) {
            props.onChange?.({ target: { value: props.min } });
            e.target.value = props.min.toString();
          }
        },
        [props.min, props.value, props.onChange],
      )
    : undefined;

  return (
    <div className="relative">
      <input
        {...props}
        id={props.name}
        className="peer w-full appearance-none border-b border-current bg-transparent outline-none focus-within:border-acan-blue"
        placeholder=" "
        onFocus={handleFocus}
        onBlur={handleInteracted}
      />
      <label
        htmlFor={props.name}
        className={classNames(
          "absolute left-0 top-0 origin-top-left -translate-y-2 scale-50 text-body transition-transform first-letter:uppercase peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-50 peer-disabled:opacity-25",
          interacted && "peer-invalid:text-demolished",
        )}
      >
        {label}
        {props.required ? "*" : null}
      </label>
    </div>
  );
};
