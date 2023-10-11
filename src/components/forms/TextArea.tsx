import { FC, TextareaHTMLAttributes } from "react";

export const TextArea: FC<
  Exclude<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name"> & {
    name: string;
    label: string;
  }
> = ({ label, ...props }) => (
  <div className="relative">
    <textarea
      id={props.name}
      {...props}
      className="peer block w-full border border-current p-4 outline-none focus-visible:border-acan-blue"
      placeholder=" "
    ></textarea>
    <label
      htmlFor={props.name}
      className="absolute left-4 top-4 origin-top-left -translate-y-2 scale-50 text-body transition-transform peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-invalid:text-demolished peer-focus:-translate-y-2 peer-focus:scale-50"
    >
      {label}
    </label>
  </div>
);
