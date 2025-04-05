'use server'

import { TTSClient } from '@/clients/tts.client'
import { cleanTextForTTS } from '@/helpers/clean-text-for-tts'

export const ttsAct = async (text: string, language?: string) => {
  const cleanedText = cleanTextForTTS(text)

  const { buffer, blobType } = await TTSClient.getInstance().speech(
    cleanedText,
    language
  )

  return 'data:' + blobType + ';base64,' + buffer.toString('base64')
}
