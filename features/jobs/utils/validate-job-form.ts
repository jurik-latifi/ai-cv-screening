import type {
  Criterion,
  EliminationRule,
} from "../schemas/job.schema";

type ValidateJobFormInput = {
  title: string;

  description: string;

  criteria:
    Criterion[];

  eliminationRules:
    EliminationRule[];

  totalWeight: number;
};

export function validateJobForm({
  title,
  description,
  criteria,
  eliminationRules,
  totalWeight,
}: ValidateJobFormInput) {
  if (
    !title.trim()
  ) {
    return "Job title is required.";
  }

  if (
    !description.trim()
  ) {
    return "Job description is required.";
  }

  if (
    criteria.length ===
    0
  ) {
    return "At least one criterion is required.";
  }

  const incompleteCriterion =
    criteria.some(
      (
        criterion
      ) =>
        !criterion.name.trim() ||
        !criterion.description.trim()
    );

  if (
    incompleteCriterion
  ) {
    return "Every criterion must have a name and description.";
  }

  if (
    totalWeight !==
    100
  ) {
    return "Criteria weights must total exactly 100%.";
  }

  const incompleteRule =
    eliminationRules.some(
      (
        rule
      ) =>
        !rule.name.trim() ||
        !rule.description.trim()
    );

  if (
    incompleteRule
  ) {
    return "Every mandatory requirement must have a name and description.";
  }

  return null;
}