'use server'

import { LLMClient } from '@/clients/llm.client'
import { LLMInput } from '@/types/llm-client-base.type'

export const llmAct = async (input: LLMInput) => {
  return LLMClient.getInstance().chat(input)
}
