'use server'

import { headers } from 'next/headers'

import { getCorrelationId } from '@/helpers/get-correlation-id'
import { getLogger } from '@/helpers/logger'
import { LLMClientFactory } from '@/clients/llm.client'
import { LLMInput } from '@/types/llm-client-base.type'

export type LLMSumarrizeActionProps = {
  input: LLMInput
}

export const llmSummarizeAct = async ({
  input,
}: Readonly<LLMSumarrizeActionProps>) => {
  const correlationId = getCorrelationId(await headers())
  const logger = getLogger().child({
    label: 'llmSummarizeAct',
    correlationId,
  })

  try {
    logger.info('Action invoked')

    const llmClient = LLMClientFactory.create(logger)

    if (!llmClient) {
      throw new Error('No LLM Provider configured')
    } else if (!llmClient.summarize) {
      throw new Error('LLM Provider does not support summarization')
    }

    const summary = await llmClient.summarize(input)

    logger.info(`Action response: ${summary}`)

    return summary
  } catch (error) {
    logger.error(error)
    logger.debug(`Input: ${JSON.stringify(input)}`)

    throw error
  }
}
