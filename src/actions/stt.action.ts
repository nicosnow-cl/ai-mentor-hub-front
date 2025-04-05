'use server'

import { STTClient } from '@/clients/stt.client'

export const sttAct = async (audio: Blob) => {
  return STTClient.getInstance().transcribe(audio)
}
