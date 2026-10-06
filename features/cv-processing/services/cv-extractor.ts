import OpenAI from "openai";

import {
  candidateProfileSchema,
  type CandidateProfile,
} from "../schemas/candidate-profile.schema";

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY,
});

const candidateProfileJsonSchema = {
  type: "object",

  additionalProperties: false,

  properties: {
    name: {
      type: "string",
    },

    email: {
      type: "string",
    },

    phone: {
      type: "string",
    },

    location: {
      type: "string",
    },

    linkedin: {
      type: "string",
    },

    summary: {
      type: "string",
    },

    workHistory: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          jobTitle: {
            type: "string",
          },

          company: {
            type: "string",
          },

          startDate: {
            type: "string",
          },

          endDate: {
            type: "string",
          },

          description: {
            type: "string",
          },
        },

        required: [
          "jobTitle",
          "company",
          "startDate",
          "endDate",
          "description",
        ],
      },
    },

    education: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          degree: {
            type: "string",
          },

          institution: {
            type: "string",
          },

          startDate: {
            type: "string",
          },

          endDate: {
            type: "string",
          },

          fieldOfStudy: {
            type: "string",
          },
        },

        required: [
          "degree",
          "institution",
          "startDate",
          "endDate",
          "fieldOfStudy",
        ],
      },
    },

    technicalSkills: {
      type: "array",

      items: {
        type: "string",
      },
    },

    languages: {
      type: "array",

      items: {
        type: "string",
      },
    },

    certifications: {
      type: "array",

      items: {
        type: "string",
      },
    },
  },

  required: [
    "name",
    "email",
    "phone",
    "location",
    "linkedin",
    "summary",
    "workHistory",
    "education",
    "technicalSkills",
    "languages",
    "certifications",
  ],
};

const extractionInstructions = `
You are a CV parsing system.

Your job is to extract a complete factual candidate profile from the supplied CV.

IMPORTANT RULES:

1. Use only information explicitly present in the CV.

2. Never invent information.

3. If a text field is unavailable, return an empty string.

4. If a list has no supported information, return an empty array.

5. Keep dates as written in the CV where possible.

6. Extract ALL explicitly mentioned technical skills.

7. A technical skill may appear anywhere in the CV:
   - skills section
   - professional summary
   - work history
   - project descriptions
   - education
   - certifications

8. Do not omit a technical skill simply because it appears outside a dedicated skills section.

9. Keep technical skills as individual items.
   Examples:
   React
   Next.js
   TypeScript
   JavaScript
   Node.js
   PostgreSQL
   Figma

10. Extract ALL explicitly mentioned spoken or written languages into the languages array.

11. A language may appear anywhere in the CV.

12. Examples of languages include:
    English
    Albanian
    German
    Italian
    French
    Spanish

13. Do NOT infer language ability from:
    - candidate name
    - nationality
    - location
    - employer
    - university
    - country

14. If English, Albanian, or another language is explicitly stated anywhere in the CV, include it in languages.

15. Extract ALL explicitly mentioned certifications.

16. Do not infer certifications.

17. Work history must contain only jobs, internships, freelance work, or professional positions supported by the CV.

18. Education must contain only education supported by the CV.

19. The summary must be a short factual professional summary based only on information in the CV.

20. Be exhaustive when extracting technical skills, languages, and certifications. Do not summarize these lists away.
`;

function normalizeStringList(
  values: string[]
) {
  const uniqueValues =
    new Map<
      string,
      string
    >();

  for (
    const value of values
  ) {
    const trimmed =
      value.trim();

    if (!trimmed) {
      continue;
    }

    const key =
      trimmed.toLowerCase();

    if (
      !uniqueValues.has(
        key
      )
    ) {
      uniqueValues.set(
        key,
        trimmed
      );
    }
  }

  return Array.from(
    uniqueValues.values()
  ).sort(
    (
      first,
      second
    ) =>
      first.localeCompare(
        second
      )
  );
}

function normalizeCandidateProfile(
  profile: CandidateProfile
): CandidateProfile {
  return {
    ...profile,

    name:
      profile.name.trim(),

    email:
      profile.email.trim(),

    phone:
      profile.phone.trim(),

    location:
      profile.location.trim(),

    linkedin:
      profile.linkedin.trim(),

    summary:
      profile.summary.trim(),

    technicalSkills:
      normalizeStringList(
        profile.technicalSkills
      ),

    languages:
      normalizeStringList(
        profile.languages
      ),

    certifications:
      normalizeStringList(
        profile.certifications
      ),

    workHistory:
      profile.workHistory.map(
        (work) => ({
          jobTitle:
            work.jobTitle.trim(),

          company:
            work.company.trim(),

          startDate:
            work.startDate.trim(),

          endDate:
            work.endDate.trim(),

          description:
            work.description.trim(),
        })
      ),

    education:
      profile.education.map(
        (education) => ({
          degree:
            education.degree.trim(),

          institution:
            education.institution.trim(),

          startDate:
            education.startDate.trim(),

          endDate:
            education.endDate.trim(),

          fieldOfStudy:
            education.fieldOfStudy.trim(),
        })
      ),
  };
}

function parseCandidateProfile(
  outputText: string
): CandidateProfile {
  let rawProfile:
    unknown;

  try {
    rawProfile =
      JSON.parse(
        outputText
      );
  } catch {
    throw new Error(
      "AI returned invalid candidate JSON."
    );
  }

  const parsed =
    candidateProfileSchema.safeParse(
      rawProfile
    );

  if (
    !parsed.success
  ) {
    console.error(
      "Candidate profile validation error:",
      parsed.error.flatten()
    );

    throw new Error(
      "AI candidate data did not match the required profile structure."
    );
  }

  return normalizeCandidateProfile(
    parsed.data
  );
}

export async function extractCandidateFromText(
  cvText: string
): Promise<CandidateProfile> {
  const response =
    await openai.responses.create({
      model:
        "gpt-5-mini",

      instructions:
        extractionInstructions,

      input: [
        {
          role:
            "user",

          content: [
            {
              type:
                "input_text",

              text: `
Extract the complete candidate profile from this CV.

Pay particular attention to:
- all technical skills
- all explicitly mentioned languages
- all certifications

--- CV START ---

${cvText}

--- CV END ---
`,
            },
          ],
        },
      ],

      text: {
        format: {
          type:
            "json_schema",

          name:
            "candidate_profile",

          strict:
            true,

          schema:
            candidateProfileJsonSchema,
        },
      },
    });

  if (
    !response.output_text
  ) {
    throw new Error(
      "AI did not return candidate data."
    );
  }

  return parseCandidateProfile(
    response.output_text
  );
}

export async function extractCandidateFromPdf(
  filename: string,
  buffer: Buffer
): Promise<CandidateProfile> {
  const base64 =
    buffer.toString(
      "base64"
    );

  const fileData =
    `data:application/pdf;base64,${base64}`;

  const response =
    await openai.responses.create({
      model:
        "gpt-5-mini",

      instructions:
        extractionInstructions,

      input: [
        {
          role:
            "user",

          content: [
            {
              type:
                "input_text",

              text: `
Read this CV PDF and extract the complete candidate profile.

Pay particular attention to:
- all technical skills
- all explicitly mentioned languages
- all certifications
`,
            },

            {
              type:
                "input_file",

              filename,

              file_data:
                fileData,
            },
          ],
        },
      ],

      text: {
        format: {
          type:
            "json_schema",

          name:
            "candidate_profile",

          strict:
            true,

          schema:
            candidateProfileJsonSchema,
        },
      },
    });

  if (
    !response.output_text
  ) {
    throw new Error(
      "AI did not return candidate data."
    );
  }

  return parseCandidateProfile(
    response.output_text
  );
}