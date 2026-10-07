import type {
  TextareaHTMLAttributes,
} from "react";

type TextareaTone =
  | "default"
  | "danger";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    tone?: TextareaTone;
  };

const toneStyles: Record<
  TextareaTone,
  string
> = {
  default:
    "focus:border-indigo-500 focus:ring-indigo-100",

  danger:
    "focus:border-red-400 focus:ring-red-100",
};

export default function Textarea({
  tone = "default",
  className = "",
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`
        w-full
        resize-none
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