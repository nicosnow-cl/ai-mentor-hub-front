'use server'

import { getLogger, parseMessage } from '@/helpers/logger'
import { LLMClient } from '@/clients/llm.client'
import { LLMInput } from '@/types/llm-client-base.type'

export const llmAct = async (input: LLMInput) => {
  const logger = getLogger().child({ label: 'llmAct' })

  try {
    logger.info(
      `Action called with input: ${parseMessage(JSON.stringify(input, null, 2))}`
    )

    const message = await LLMClient.getInstance().chat(input)

    logger.info(
      `Action response: ${parseMessage(JSON.stringify(message, null, 2))}`
    )

    return message
  } catch (error) {
    logger.error(error)

    throw error
  }
}
