import { z } from "zod";

const EnvironmentSchema = z.object({
  DEEPGRAM_API_KEY: z.string().default(""),
  ELEVENLABS_API_KEY: z.string().default(""),
  MURF_API_KEY: z.string().default(""),
  OPENROUTER_API_KEY: z.string().default(""),
  AWS_ACCESS_KEY: z.string().default(""),
  AWS_SECRET_KEY: z.string().default(""),
});

export const ENV_VARS = EnvironmentSchema.parse(process.env);
