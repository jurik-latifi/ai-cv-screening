import Badge from "@/components/ui/badge";

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
  const variant =
    category ===
    "Strong Match"
      ? "success"
      : category ===
          "Potential Match"
        ? "warning"
        : "danger";

  return (
    <Badge variant={variant}>
      {category}
    </Badge>
  );
}