type Category =
  | "Strong Match"
  | "Potential Match"
  | "Unmatched";

type CategoryBadgeProps = {
  category: Category;
};

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  const style =
    category ===
    "Strong Match"
      ? "bg-emerald-100 text-emerald-700"
      : category ===
        "Potential Match"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${style}`}
    >
      {category}
    </span>
  );
}