import { z } from "zod";

export const workHistorySchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

export const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  fieldOfStudy: z.string(),
});

export const candidateProfileSchema = z.object({
  name: z.string(),

  email: z.string(),

  phone: z.string(),

  location: z.string(),

  linkedin: z.string(),

  summary: z.string(),

  workHistory: z.array(
    workHistorySchema
  ),

  education: z.array(
    educationSchema
  ),

  technicalSkills: z.array(
    z.string()
  ),

  /*
   * Languages explicitly mentioned
   * in the CV.
   *
   * default([]) keeps older candidate
   * profiles compatible because they
   * were saved before this field existed.
   */
  languages: z
    .array(
      z.string()
    )
    .default([]),

  certifications: z.array(
    z.string()
  ),
});

export type CandidateProfile =
  z.infer<
    typeof candidateProfileSchema
  >;