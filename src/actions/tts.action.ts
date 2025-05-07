'use server'

import { TTSClient } from '@/clients/tts.client'
import { cleanTextForTTS } from '@/helpers/clean-text-for-tts'

export const ttsAct = async (text: string, language?: string) => {
  try {
    const cleanedText = cleanTextForTTS(text)

    const { buffer, blobType } = await TTSClient.getInstance().speech(
      cleanedText,
      language
    )

    return {
      base64: 'data:' + blobType + ';base64,' + buffer.toString('base64'),
    }
  } catch (error) {
    console.error('Error in TTS action:', error)

    return { error: 'Error in TTS action' }
  }
}
