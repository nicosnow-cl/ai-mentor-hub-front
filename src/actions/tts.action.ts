'use server'

import { headers } from 'next/headers'

import { getCorrelationId } from '@/helpers/get-correlation-id'
import { cleanTextForTTS } from '@/helpers/clean-text-for-tts'
import { getLogger } from '@/helpers/logger'
import { TTSClient } from '@/clients/tts.client'

export const ttsAct = async (text: string, language?: string) => {
  const correlationId = getCorrelationId(await headers())
  const logger = getLogger().child({ correlationId, label: 'ttsAct' })

  try {
    logger.info(`Action invoked`)

    const cleanedText = cleanTextForTTS(text)

    const { buffer, blobType } = await TTSClient.getInstance().speech(
      cleanedText,
      language
    )

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
