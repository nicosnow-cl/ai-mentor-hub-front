'use server'

import { headers } from 'next/headers'

import { getCorrelationId } from '@/helpers/get-correlation-id'
import { getLogger } from '@/helpers/logger'
import { STTClient } from '@/clients/stt.client'

export const sttAct = async (audio: Blob) => {
  const correlationId = getCorrelationId(await headers())
  const logger = getLogger().child({ correlationId, label: 'sttAct' })

  try {
    logger.info('Action invoked')

    const transcription = await STTClient.getInstance().transcribe(audio)

    logger.info(`Action response: ${JSON.stringify(transcription)}`)

    return transcription
  } catch (error) {
    logger.error(error)
    logger.debug(`Input: ${JSON.stringify(audio)}`)

    throw error
  }
}
