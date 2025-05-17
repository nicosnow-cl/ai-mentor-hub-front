import { ElevenLabsClient } from 'elevenlabs'
import { Logger } from 'winston'

import { streamToBuffer } from '@/helpers/stream-to-buffer'
import { TTSClientBase } from '@/types/tts-client-base.type'

export class TTSElevenLabsClient implements TTSClientBase {
  private readonly config: Record<string, string>
  private readonly client: ElevenLabsClient
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config
    this.client = new ElevenLabsClient({
      apiKey: config.apiKey,
    })

    if (logger) {
      this.logger = logger.child({ label: TTSElevenLabsClient.name })

      this.logger.info(
        `TTS client initialized with model: ${this.config.model}`
      )
    }
  }

  async speech(text: string): Promise<{
    buffer: Buffer
    blobType: string
  }> {
    const audioStream = await this.client.textToSpeech.convert(
      this.config.voice,
      {
        text,
        model_id: this.config.model,
        output_format: 'mp3_44100_128',
      }
    )

    return {
      buffer: await streamToBuffer(audioStream),
      blobType: 'audio/mpeg',
    }
  }
}
