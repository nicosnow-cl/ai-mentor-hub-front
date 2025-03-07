import { z } from "zod";

const EnvironmentSchema = z.object({
  OPENROUTER_API_KEY: z.string().default(""),
  ELEVENLABS_API_KEY: z.string().default(""),
  MURF_API_KEY: z.string().default(""),
});

export const ENV_VARS = EnvironmentSchema.parse(process.env);
