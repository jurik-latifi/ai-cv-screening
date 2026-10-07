import type {
  InputHTMLAttributes,
} from "react";

type InputTone =
  | "default"
  | "danger";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    tone?: InputTone;
  };

const toneStyles: Record<
  InputTone,
  string
> = {
  default:
    "focus:border-indigo-500 focus:ring-indigo-100",

  danger:
    "focus:border-red-400 focus:ring-red-100",
};

export default function Input({
  tone = "default",
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-3
        text-sm
        text-slate-900
        outline-none
        transition
        placeholder:text-slate-500
        focus:ring-2
        ${toneStyles[tone]}
        ${className}
      `}
      {...props}
    />
  );
}