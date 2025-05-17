import { Logger } from 'winston'

import { TTSClientBase } from '@/types/tts-client-base.type'

export class TTSMurfAIClient implements TTSClientBase {
  private readonly config: Record<string, string>
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config

    if (logger) {
      this.logger = logger.child({ label: TTSMurfAIClient.name })

      this.logger.info(
        `TTS client initialized with model: ${this.config.model}`
      )
    }
  }

  private getPayload(text: string) {
    return {
      model: this.config.model,
      voiceId: this.config.voice,
      style: this.config.style,
      text,
    }
  }

  async speech(text: string): Promise<{
    buffer: Buffer
    blobType: string
  }> {
    const res = await fetch(`${this.config.baseUrl}/speech/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': this.config.apiKey,
      },
      body: JSON.stringify(this.getPayload(text)),
    })

    const data = await res.json()

    const resAudioFile = await fetch(data.audioFile)
    const audioBlob = await resAudioFile.blob()

    return {
      buffer: Buffer.from(await audioBlob.arrayBuffer()),
      blobType: audioBlob.type,
    }
  }
}
