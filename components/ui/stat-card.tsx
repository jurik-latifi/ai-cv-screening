import Card from "./card";

type StatCardTone =
  | "default"
  | "primary"
  | "success"
  | "danger";

type StatCardProps = {
  label: string;

  value:
    | string
    | number;

  icon:
    | string
    | number;

  tone?: StatCardTone;
};

const toneStyles = {
  default: {
    value:
      "text-slate-900",

    icon:
      "bg-slate-100 text-slate-700",
  },

  primary: {
    value:
      "text-slate-900",

    icon:
      "bg-indigo-50 text-indigo-600",
  },

  success: {
    value:
      "text-emerald-600",

    icon:
      "bg-emerald-50 text-emerald-600",
  },

  danger: {
    value:
      "text-red-600",

    icon:
      "bg-red-50 text-red-600",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: StatCardProps) {
  const styles =
    toneStyles[tone];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${styles.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${styles.icon}`}
        >
          {icon}
        </div>

      </div>
    </Card>
  );
}