import {
  Engine,
  OutputFormat,
  PollyClient,
  SynthesizeSpeechCommandInput,
  VoiceId,
} from '@aws-sdk/client-polly'
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import { Logger } from 'winston'

import { TTSClientBase } from '@/types/tts-client-base.type'

const REGION = 'us-east-1'

export class TTSAWSClient implements TTSClientBase {
  private readonly config: Record<string, string>
  private readonly client: PollyClient
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config
    this.client = new PollyClient({
      region: REGION,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
    })

    if (logger) {
      this.logger = logger.child({ label: TTSAWSClient.name })

      this.logger.info(
        `TTS client initialized with model: ${this.config.model}`
      )
    }
  }

  private getParams(text: string): SynthesizeSpeechCommandInput {
    return {
      OutputFormat: OutputFormat.MP3,
      Engine: this.config.model as Engine,
      VoiceId: this.config.voice as VoiceId,
      Text: text,
    }
  }

  async speech(text: string): Promise<{
    buffer: Buffer
    blobType: string
  }> {
    const params = this.getParams(text)
    const pollyRes = await this.client.send(new SynthesizeSpeechCommand(params))

    if (!pollyRes.AudioStream) {
      throw new Error('Error generating audio')
    }

    return {
      buffer: Buffer.from(
        (await pollyRes.AudioStream?.transformToByteArray()).buffer
      ),
      blobType: pollyRes.ContentType as string,
    }
  }
}
