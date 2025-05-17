import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech'
import { Logger } from 'winston'

import { TTSClientBase } from '@/types/tts-client-base.type'

export class TTSGCPClient implements TTSClientBase {
  private readonly config: Record<string, string>
  private readonly client: TextToSpeechClient
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config
    this.client = new TextToSpeechClient({
      apiKey: config.apiKey,
    })

    if (logger) {
      this.logger = logger.child({ label: TTSGCPClient.name })

      this.logger.info(
        `TTS client initialized with model: ${this.config.model}`
      )
    }
  }

  getParams(
    text: string
  ): protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest {
    return {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: this.config
          .voice as protos.google.cloud.texttospeech.v1.IVoiceSelectionParams['ssmlGender'],
      },
      audioConfig: { audioEncoding: 'MP3' },
    }
  }

  async speech(text: string): Promise<{
    buffer: Buffer
    blobType: string
  }> {
    try {
      const params = this.getParams(text)
      const [response] = await this.client.synthesizeSpeech(params)

      if (!response.audioContent || typeof response.audioContent === 'string') {
        throw new Error('Error generating audio')
      }

      return {
        buffer: Buffer.from(response.audioContent),
        blobType: 'audio/mpeg',
      }
    } catch (error) {
      console.error('Error in TTSGCPClient.speech:', error)

      throw new Error('Error generating audio')
    }
  }
}
