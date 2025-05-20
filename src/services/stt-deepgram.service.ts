import { createRequire } from 'node:module'
import { Logger } from 'winston'
import { SyncPrerecordedResponse, DeepgramClient } from '@deepgram/sdk'

import { STTClientBase, TranscribeResult } from '@/types/stt-client-base.type'

const require = createRequire(import.meta.url)
const { createClient } = require('@deepgram/sdk')

export class STTDeepgramClient implements STTClientBase {
  private readonly config: Record<string, string>
  private readonly client: DeepgramClient
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config
    this.client = createClient(this.config.apiKey)

    if (logger) {
      this.logger = logger.child({ label: STTDeepgramClient.name })

      this.logger.info(
        `STT client initialized with model: ${this.config.model}`
      )
    }
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
        detect_language: true,
        smart_format: true,
      })

    if (error) {
      this.logger?.error(error)

      return {
        text: '',
        language: 'es',
      }
    }

    return this.mapResponseToTranscribeResult(result)
  }
}
