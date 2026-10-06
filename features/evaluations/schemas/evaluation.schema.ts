import { z } from "zod";

export const satisfactionLevelSchema = z.enum([
  "NONE",
  "WEAK",
  "PARTIAL",
  "GOOD",
  "STRONG",
  "EXCELLENT",
]);

export type SatisfactionLevel = z.infer<
  typeof satisfactionLevelSchema
>;

/*
 * Raw criterion evaluation returned by AI.
 *
 * AI does NOT choose the final numeric score.
 * It only chooses one fixed satisfaction level
 * and explains the evidence behind that level.
 */
export const criterionEvaluationSchema =
  z.object({
    level:
      satisfactionLevelSchema,

    reasoning:
      z.string(),
  });

/*
 * Raw mandatory / elimination rule
 * evaluation returned by AI.
 */
export const eliminationEvaluationSchema =
  z.object({
    passed:
      z.boolean(),

    reasoning:
      z.string(),
  });

/*
 * Complete raw AI response.
 */
export const aiEvaluationSchema =
  z.object({
    criteria:
      z.array(
        criterionEvaluationSchema
      ),

    eliminationRules:
      z.array(
        eliminationEvaluationSchema
      ),

    justification:
      z.string(),
  });

export type AIEvaluation =
  z.infer<
    typeof aiEvaluationSchema
  >;

/*
 * Final criterion result used
 * by the application.
 *
 * Numeric score and weightedScore
 * are calculated deterministically
 * by our application code.
 */
export type CriterionResult = {
  criterionName: string;

  score: number;

  reasoning: string;

  weight: number;

  weightedScore: number;
};

export type EliminationResult = {
  ruleName: string;

  passed: boolean;

  reasoning: string;
};

export type EvaluationResult = {
  matchScore: number;

  fitCategory:
    | "Strong Match"
    | "Potential Match"
    | "Unmatched";

  criteria:
    CriterionResult[];

  eliminationRules:
    EliminationResult[];

  justification: string;

  failedEliminationRule:
    boolean;
};