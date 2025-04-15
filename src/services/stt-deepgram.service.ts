import { createRequire } from 'node:module'
import { SyncPrerecordedResponse, DeepgramClient } from '@deepgram/sdk'

import { STTClientBase, TranscribeResult } from '@/types/chats'

const require = createRequire(import.meta.url)
const { createClient } = require('@deepgram/sdk')

export class STTDeepgramClient implements STTClientBase {
  private readonly config: Record<string, string>
  private readonly client: DeepgramClient

  constructor(config: Record<string, string>) {
    this.config = config
    this.client = createClient(this.config.apiKey)
  }

  private mapResponseToTranscribeResult(
    response: SyncPrerecordedResponse | null
  ) {
    if (!response?.results) {
      return {
        text: '',
        language: 'es',
      }
    }

    const { alternatives, detected_language } = response?.results.channels[0]

    return {
      text: alternatives[0].transcript,
      language: detected_language || 'es',
    }
  }

  async transcribe(audio: Blob | File): Promise<TranscribeResult> {
    const arrayBuffer = await audio.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { result, error } =
      await this.client.listen.prerecorded.transcribeFile(buffer, {
        model: this.config.model,
        language: 'es-ES',
        smart_format: true,
      })

    if (error) {
      console.error(error)

      return {
        text: '',
        language: 'es',
      }
    }

    return this.mapResponseToTranscribeResult(result)
  }
}
