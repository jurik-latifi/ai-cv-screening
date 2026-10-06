import { z } from "zod";

export const criterionSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Criterion name is required"
      ),

    description: z
      .string()
      .trim()
      .min(
        1,
        "Criterion description is required"
      ),

    weight: z
      .number()
      .min(
        1,
        "Criterion weight must be at least 1%"
      )
      .max(
        100,
        "Criterion weight cannot exceed 100%"
      ),
  });

export const eliminationRuleSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Requirement name is required"
      ),

    description: z
      .string()
      .trim()
      .min(
        1,
        "Requirement description is required"
      ),
  });

export const jobSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        3,
        "Job title must have at least 3 characters"
      ),

    description: z
      .string()
      .trim()
      .min(
        5,
        "Job description must have at least 5 characters"
      ),

    criteria: z
      .array(
        criterionSchema
      )
      .min(
        1,
        "At least one criterion is required"
      )
      .refine(
        (criteria) => {
          const totalWeight =
            criteria.reduce(
              (
                sum,
                criterion
              ) =>
                sum +
                criterion.weight,
              0
            );

          return (
            Math.abs(
              totalWeight -
                100
            ) < 0.001
          );
        },
        {
          message:
            "Criteria weights must total 100%",
        }
      ),

    eliminationRules:
      z.array(
        eliminationRuleSchema
      ),
  });

export type Criterion =
  z.infer<
    typeof criterionSchema
  >;

export type EliminationRule =
  z.infer<
    typeof eliminationRuleSchema
  >;

export type CreateJobInput =
  z.infer<
    typeof jobSchema
  >;