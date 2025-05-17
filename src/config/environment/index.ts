import { z } from 'zod'

import { LLMProvider, STTProvider, TTSProvider } from '@/enums'

const EnvironmentSchema = z.object({
  LLM_PROVIDER: z.nativeEnum(LLMProvider, { message: 'Invalid LLM provider' }),
  STT_PROVIDER: z
    .nativeEnum(STTProvider, { message: 'Invalid STT provider' })
    .optional(),
  TTS_PROVIDER: z
    .nativeEnum(TTSProvider, { message: 'Invalid TTS provider' })
    .optional(),
  DEEPGRAM_API_KEY: z.string().default(''),
  ELEVENLABS_API_KEY: z.string().default(''),
  MURF_API_KEY: z.string().default(''),
  OPENROUTER_API_KEY: z.string().default(''),
  AWS_ACCESS_KEY: z.string().default(''),
  AWS_SECRET_KEY: z.string().default(''),
  TTS_AZURE_SUBSCRIPTION_KEY: z.string().default(''),
  STT_AZURE_SUBSCRIPTION_KEY: z.string().default(''),
  LLM_GCP_API_KEY: z.string().default(''),
  TTS_GCP_API_KEY: z.string().default(''),
  STT_GCP_API_KEY: z.string().default(''),
})

export const ENV_VARS = EnvironmentSchema.parse(process.env)
