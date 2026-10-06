import OpenAI from "openai";

import {
  aiEvaluationSchema,
  type EvaluationResult,
  type SatisfactionLevel,
} from "../schemas/evaluation.schema";

import type { CandidateProfile } from "@/features/cv-processing/schemas/candidate-profile.schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type JobCriterion = {
  name: string;
  description: string;
  weight: number;
};

type EliminationRule = {
  name: string;
  description: string;
};

type EvaluateCandidateInput = {
  candidate: CandidateProfile;

  jobTitle: string;

  jobDescription: string;

  criteria: JobCriterion[];

  eliminationRules: EliminationRule[];
};

/*
 * The AI chooses a level.
 *
 * Our application converts the
 * level into a fixed numeric score.
 */
const SCORE_BY_LEVEL: Record<SatisfactionLevel, number> = {
  NONE: 0,
  WEAK: 2,
  PARTIAL: 4,
  GOOD: 6,
  STRONG: 8,
  EXCELLENT: 10,
};

const evaluationJsonSchema = {
  type: "object",

  additionalProperties: false,

  properties: {
    criteria: {
      type: "array",

      items: {
        type: "object",

        additionalProperties: false,

        properties: {
          level: {
            type: "string",

            enum: ["NONE", "WEAK", "PARTIAL", "GOOD", "STRONG", "EXCELLENT"],
          },

          reasoning: {
            type: "string",
          },
        },

        required: ["level", "reasoning"],
      },
    },

    eliminationRules: {
      type: "array",

      items: {
        type: "object",

        additionalProperties: false,

        properties: {
          passed: {
            type: "boolean",
          },

          reasoning: {
            type: "string",
          },
        },

        required: ["passed", "reasoning"],
      },
    },

    justification: {
      type: "string",
    },
  },

  required: ["criteria", "eliminationRules", "justification"],
};

export async function evaluateCandidate({
  candidate,
  jobTitle,
  jobDescription,
  criteria,
  eliminationRules,
}: EvaluateCandidateInput): Promise<EvaluationResult> {
  const totalWeight = criteria.reduce(
    (total, criterion) => total + criterion.weight,
    0,
  );

  if (criteria.some((criterion) => criterion.weight <= 0)) {
    throw new Error(
      "Every evaluation criterion must have a weight greater than 0%.",
    );
  }

  if (Math.abs(totalWeight - 100) > 0.001) {
    throw new Error("Evaluation criteria weights must total 100%.");
  }

  const response = await openai.responses.create({
    model: "gpt-5-mini",

    instructions: `
You are a recruitment evaluation agent.

Evaluate the candidate objectively against the supplied job requirements.

IMPORTANT RULES:

1. Use only information contained in the candidate profile.

2. Do not invent experience, education, certifications, skills, languages, or other qualifications.

3. Evaluate contextual relevance, not only exact keyword matches.

4. Return one evaluation for EVERY criterion.

5. Keep criterion evaluations in exactly the same order provided.

6. Do NOT choose a numeric score.

7. For each criterion, choose exactly one satisfaction level using this rubric:

NONE = No relevant evidence at all.

WEAK = Very weak or indirect evidence; the requirement is mostly unmet.

PARTIAL = Some relevant evidence, but important parts of the requirement are missing.

GOOD = Clear relevant evidence; the requirement is substantially met, with some gaps.

STRONG = Strong direct evidence; the requirement is met very well with only minor gaps.

EXCELLENT = Exceptional and complete direct evidence; the requirement is fully satisfied or exceeded.

8. Apply the rubric consistently. Do not move a candidate between adjacent levels merely because of wording style.

9. Base each level on explicit evidence in the candidate profile and explain the most relevant evidence or gap.

10. Evaluate EVERY mandatory elimination rule.

11. Keep mandatory rule evaluations in exactly the same order provided.

12. A mandatory rule passes only when the candidate profile clearly provides evidence that the requirement is satisfied.

13. If evidence is missing or insufficient for a mandatory requirement, mark it as failed.

14. If a mandatory rule contains alternatives such as "A OR B", satisfying any one listed alternative is sufficient to pass.

15. Do not infer qualifications from the candidate's name, location, nationality, school, or employer.

16. The justification must be 2-3 concise sentences describing the strongest matches and the most important gaps.

17. Do not calculate the final weighted percentage. The application will calculate all numeric scores.
`,

    input: [
      {
        role: "user",

        content: [
          {
            type: "input_text",

            text: `
JOB TITLE:
${jobTitle}

JOB DESCRIPTION:
${jobDescription}

JOB CRITERIA:
${JSON.stringify(criteria, null, 2)}

MANDATORY ELIMINATION RULES:
${JSON.stringify(eliminationRules, null, 2)}

CANDIDATE PROFILE:
${JSON.stringify(candidate, null, 2)}

Evaluate this candidate.
`,
          },
        ],
      },
    ],

    text: {
      format: {
        type: "json_schema",

        name: "candidate_evaluation",

        strict: true,

        schema: evaluationJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("AI did not return an evaluation.");
  }

  let rawEvaluation: unknown;

  try {
    rawEvaluation = JSON.parse(response.output_text);
  } catch {
    throw new Error("AI returned invalid evaluation JSON.");
  }

  const parsed = aiEvaluationSchema.safeParse(rawEvaluation);

  if (!parsed.success) {
    console.error("Evaluation validation error:", parsed.error.flatten());

    throw new Error("AI evaluation did not match the required structure.");
  }

  const aiEvaluation = parsed.data;

  /*
   * Make sure every criterion
   * was evaluated.
   */
  if (aiEvaluation.criteria.length !== criteria.length) {
    throw new Error("AI did not evaluate all job criteria.");
  }

  /*
   * Make sure every mandatory
   * rule was evaluated.
   */
  if (aiEvaluation.eliminationRules.length !== eliminationRules.length) {
    throw new Error("AI did not evaluate all mandatory requirements.");
  }

  /*
   * Build final criterion results.
   *
   * AI:
   * GOOD
   *
   * Application:
   * GOOD -> 6/10
   */
  const criterionResults = criteria.map((criterion, index) => {
    const evaluation = aiEvaluation.criteria[index];

    const score = SCORE_BY_LEVEL[evaluation.level];

    const rawWeightedScore = (score / 10) * criterion.weight;

    const weightedScore = Math.round(rawWeightedScore * 100) / 100;

    return {
      /*
       * Use our configured
       * criterion name,
       * not a generated name.
       */
      criterionName: criterion.name,

      score,

      reasoning: evaluation.reasoning,

      weight: criterion.weight,

      weightedScore,
    };
  });

  /*
   * Build final mandatory-rule
   * results.
   */
  const eliminationResults = eliminationRules.map((rule, index) => {
    const evaluation = aiEvaluation.eliminationRules[index];

    return {
      /*
       * Use our configured
       * rule name.
       */
      ruleName: rule.name,

      passed: evaluation.passed,

      reasoning: evaluation.reasoning,
    };
  });

  /*
   * Deterministic final score.
   */
  const totalWeightedScore = criterionResults.reduce(
    (total, criterion) => total + criterion.weightedScore,
    0,
  );

  const matchScore = Math.round(totalWeightedScore * 100) / 100;

  /*
   * Check hard requirements.
   */
  const failedEliminationRule = eliminationResults.some((rule) => !rule.passed);

  /*
   * Determine final tier.
   */
  let fitCategory: "Strong Match" | "Potential Match" | "Unmatched";

  if (failedEliminationRule) {
    fitCategory = "Unmatched";
  } else if (matchScore >= 85) {
    fitCategory = "Strong Match";
  } else if (matchScore >= 65) {
    fitCategory = "Potential Match";
  } else {
    fitCategory = "Unmatched";
  }

  return {
    matchScore,

    fitCategory,

    criteria: criterionResults,

    eliminationRules: eliminationResults,

    justification: aiEvaluation.justification,

    failedEliminationRule,
  };
}