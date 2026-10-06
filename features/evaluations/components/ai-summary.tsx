import type {
  CandidateProfile,
} from "@/features/cv-processing/schemas/candidate-profile.schema";

import type {
  EvaluationResult,
} from "@/features/evaluations/schemas/evaluation.schema";

import type {
  Criterion,
} from "@/features/jobs/schemas/job.schema";

import CategoryBadge from "./category-badge";

import ScoreDisplay from "./score-display";

import EvaluationCriterionCard from "./evaluation-criterion-card";

import MandatoryRuleResult from "./mandatory-rule-result";

type AISummaryProps = {
  candidate:
    CandidateProfile;

  evaluation:
    EvaluationResult;

  criteria:
    Criterion[];
};

export default function AISummary({
  candidate,
  evaluation,
  criteria,
}: AISummaryProps) {
  function getWeight(
    criterionName: string
  ) {
    const matchedCriterion =
      criteria.find(
        (criterion) =>
          criterion.name
            .trim()
            .toLowerCase() ===
          criterionName
            .trim()
            .toLowerCase()
      );

    return (
      matchedCriterion?.weight ??
      0
    );
  }

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-5">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              AI Analysis
            </p>

            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              Candidate Summary
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              {
                evaluation.justification
              }
            </p>
          </div>

          <div className="text-right">

            <ScoreDisplay
              score={
                evaluation.matchScore
              }
              size="large"
            />

            <div className="mt-2">

              <CategoryBadge
                category={
                  evaluation.fitCategory
                }
              />
            </div>
          </div>
        </div>

        {evaluation.failedEliminationRule && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Candidate failed at least
            one mandatory requirement.
          </div>
        )}
      </section>

      {/* PROFILE */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-slate-900">
          Candidate Profile
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Name
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {candidate.name ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {candidate.email ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Phone
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {candidate.phone ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Location
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {candidate.location ||
                "Not provided"}
            </p>
          </div>

          <div className="md:col-span-2">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              LinkedIn
            </p>

            <p className="mt-1 break-all text-sm text-slate-700">
              {candidate.linkedin ||
                "Not provided"}
            </p>
          </div>
        </div>

        {candidate.summary && (
          <div className="mt-6 border-t border-slate-200 pt-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Profile Summary
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {
                candidate.summary
              }
            </p>
          </div>
        )}
      </section>

      {/* SKILLS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-slate-900">
          Technical Skills
        </h3>

        {candidate.technicalSkills
          .length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No technical skills
            detected.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">

            {candidate.technicalSkills.map(
              (
                skill,
                index
              ) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        )}
      </section>

      {/* EVALUATION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-slate-900">
          Evaluation Criteria
        </h3>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">

          {evaluation.criteria.map(
            (
              criterion,
              index
            ) => (
              <EvaluationCriterionCard
                key={`${criterion.criterionName}-${index}`}
                name={
                  criterion.criterionName
                }
                score={
                  criterion.score
                }
                weight={
                  getWeight(
                    criterion.criterionName
                  )
                }
                weightedScore={
                  criterion.weightedScore
                }
                reasoning={
                  criterion.reasoning
                }
              />
            )
          )}
        </div>
      </section>

      {/* MANDATORY RULES */}
      {evaluation.eliminationRules
        .length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Mandatory Requirements
          </h3>

          <div className="mt-5 space-y-3">

            {evaluation.eliminationRules.map(
              (
                rule,
                index
              ) => (
                <MandatoryRuleResult
                  key={`${rule.ruleName}-${index}`}
                  name={
                    rule.ruleName
                  }
                  passed={
                    rule.passed
                  }
                  reasoning={
                    rule.reasoning
                  }
                />
              )
            )}
          </div>
        </section>
      )}

      {/* WORK HISTORY */}
      {candidate.workHistory
        .length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Work History
          </h3>

          <div className="mt-5 space-y-4">

            {candidate.workHistory.map(
              (
                work,
                index
              ) => (
                <div
                  key={`${work.company}-${work.jobTitle}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >

                  <p className="font-semibold text-slate-900">
                    {
                      work.jobTitle
                    }
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {
                      work.company
                    }
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {
                      work.startDate
                    }{" "}
                    —{" "}
                    {
                      work.endDate
                    }
                  </p>

                  {work.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {
                        work.description
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {candidate.education
        .length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Education
          </h3>

          <div className="mt-5 space-y-4">

            {candidate.education.map(
              (
                education,
                index
              ) => (
                <div
                  key={`${education.institution}-${education.degree}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >

                  <p className="font-semibold text-slate-900">
                    {
                      education.degree
                    }
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {
                      education.institution
                    }
                  </p>

                  {education.fieldOfStudy && (
                    <p className="mt-1 text-sm text-slate-500">
                      {
                        education.fieldOfStudy
                      }
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    {
                      education.startDate
                    }{" "}
                    —{" "}
                    {
                      education.endDate
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {candidate.certifications
        .length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Certifications
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">

            {candidate.certifications.map(
              (
                certification,
                index
              ) => (
                <span
                  key={`${certification}-${index}`}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {
                    certification
                  }
                </span>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}