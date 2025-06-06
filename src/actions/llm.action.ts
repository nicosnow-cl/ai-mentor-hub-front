'use server'

import { headers } from 'next/headers'

import { getCorrelationId } from '@/helpers/get-correlation-id'
import { getLogger } from '@/helpers/logger'
import { LLMClientFactory } from '@/clients/llm.client'
import { LLMInput } from '@/types/llm-client-base.type'
import { SettingsSchema } from '@/schemas/settings.schema'

export type LLMActionProps = {
  input: LLMInput
  settings?: SettingsSchema
  summary?: string
}

export const llmAct = async ({
  input,
  settings,
  summary,
}: Readonly<LLMActionProps>) => {
  const correlationId = getCorrelationId(await headers())
  const logger = getLogger().child({ label: 'llmAct', correlationId })

  try {
    logger.info('Action invoked')

    const llmClient = LLMClientFactory.create(logger, settings)

    if (!llmClient) {
      throw new Error('No LLM Provider configured')
    }

    const message = await llmClient.chat(input, summary)

    if (!message.createdAt) {
      message.createdAt = new Date().toISOString()
    }

    logger.info(`Action response: ${JSON.stringify(message)}`)

    return message
  } catch (error) {
    logger.error(error)
    logger.debug(`Input: ${JSON.stringify(input)}`)

    throw error
  }
}
