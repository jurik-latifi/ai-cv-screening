import Alert from "@/components/ui/alert";

import SectionCard from "@/components/ui/section-card";

import Tag from "@/components/ui/tag";

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

import ProfileField from "./profile-field";

import TimelineItem from "./timeline-item";

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
      <SectionCard>

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
          <Alert
            variant="danger"
            className="mt-5"
          >
            Candidate failed at least one mandatory requirement.
          </Alert>
        )}

      </SectionCard>

      {/* PROFILE */}
      <SectionCard
        title="Candidate Profile"
      >

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <ProfileField
            label="Name"
            value={
              candidate.name
            }
          />

          <ProfileField
            label="Email"
            value={
              candidate.email
            }
          />

          <ProfileField
            label="Phone"
            value={
              candidate.phone
            }
          />

          <ProfileField
            label="Location"
            value={
              candidate.location
            }
          />

          <ProfileField
            label="LinkedIn"
            value={
              candidate.linkedin
            }
            className="md:col-span-2"
          />

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

      </SectionCard>

      {/* SKILLS */}
      <SectionCard
        title="Technical Skills"
      >

        {candidate
          .technicalSkills
          .length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No technical skills detected.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">

            {candidate.technicalSkills.map(
              (
                skill,
                index
              ) => (
                <Tag
                  key={`${skill}-${index}`}
                  variant="primary"
                >
                  {skill}
                </Tag>
              )
            )}

          </div>
        )}

      </SectionCard>

      {/* LANGUAGES */}
      {candidate.languages
        .length > 0 && (
        <SectionCard
          title="Languages"
        >

          <div className="mt-4 flex flex-wrap gap-2">

            {candidate.languages.map(
              (
                language,
                index
              ) => (
                <Tag
                  key={`${language}-${index}`}
                >
                  {language}
                </Tag>
              )
            )}

          </div>

        </SectionCard>
      )}

      {/* EVALUATION */}
      <SectionCard
        title="Evaluation Criteria"
      >

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

      </SectionCard>

      {/* MANDATORY RULES */}
      {evaluation
        .eliminationRules
        .length > 0 && (
        <SectionCard
          title="Mandatory Requirements"
        >

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

        </SectionCard>
      )}

      {/* WORK HISTORY */}
      {candidate.workHistory
        .length > 0 && (
        <SectionCard
          title="Work History"
        >

          <div className="mt-5 space-y-4">

            {candidate.workHistory.map(
              (
                work,
                index
              ) => (
                <TimelineItem
                  key={`${work.company}-${work.jobTitle}-${index}`}
                  title={
                    work.jobTitle
                  }
                  subtitle={
                    work.company
                  }
                  startDate={
                    work.startDate
                  }
                  endDate={
                    work.endDate
                  }
                  description={
                    work.description
                  }
                />
              )
            )}

          </div>

        </SectionCard>
      )}

      {/* EDUCATION */}
      {candidate.education
        .length > 0 && (
        <SectionCard
          title="Education"
        >

          <div className="mt-5 space-y-4">

            {candidate.education.map(
              (
                education,
                index
              ) => (
                <TimelineItem
                  key={`${education.institution}-${education.degree}-${index}`}
                  title={
                    education.degree
                  }
                  subtitle={
                    education.institution
                  }
                  secondaryText={
                    education.fieldOfStudy
                  }
                  startDate={
                    education.startDate
                  }
                  endDate={
                    education.endDate
                  }
                />
              )
            )}

          </div>

        </SectionCard>
      )}

      {/* CERTIFICATIONS */}
      {candidate
        .certifications
        .length > 0 && (
        <SectionCard
          title="Certifications"
        >

          <div className="mt-4 flex flex-wrap gap-2">

            {candidate.certifications.map(
              (
                certification,
                index
              ) => (
                <Tag
                  key={`${certification}-${index}`}
                >
                  {
                    certification
                  }
                </Tag>
              )
            )}

          </div>

        </SectionCard>
      )}

    </div>
  );
}