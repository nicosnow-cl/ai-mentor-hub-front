'use server'

import { headers } from 'next/headers'

import { cleanTextForTTS } from '@/helpers/clean-text-for-tts'
import { getCorrelationId } from '@/helpers/get-correlation-id'
import { getLogger } from '@/helpers/logger'
import { TTSClientFactory } from '@/clients/tts.client'

export const ttsAct = async (text: string, language?: string) => {
  const correlationId = getCorrelationId(await headers())
  const logger = getLogger().child({ correlationId, label: 'ttsAct' })

  try {
    logger.info(`Action invoked`)

    const cleanedText = cleanTextForTTS(text)

    const ttsClient = TTSClientFactory.create(logger)

    if (!ttsClient) {
      throw new Error('No TTS Provider configured')
    }

    const { buffer, blobType } = await ttsClient.speech(cleanedText, language)

    const audio = {
      base64: 'data:' + blobType + ';base64,' + buffer.toString('base64'),
    }

    logger.info(`Action response: ${JSON.stringify(audio)}`)

    return audio
  } catch (error) {
    logger.error(error)
    logger.debug(`Input: ${text}`)

    throw error
  }
}
