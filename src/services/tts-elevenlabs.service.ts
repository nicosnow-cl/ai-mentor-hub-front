import { ElevenLabsClient } from 'elevenlabs'

import { streamToBuffer } from '@/helpers/stream-to-buffer'
import { TTSClientBase } from '@/types/chats'

export class TTSElevenLabsClient implements TTSClientBase {
  private readonly config: Record<string, string>
  private readonly client: ElevenLabsClient

  constructor(config: Record<string, string>) {
    this.config = config

    this.client = new ElevenLabsClient({
      apiKey: config.apiKey,
    })
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
