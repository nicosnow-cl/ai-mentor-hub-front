import {
  Engine,
  OutputFormat,
  PollyClient,
  SynthesizeSpeechCommandInput,
  VoiceId,
} from '@aws-sdk/client-polly'
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly'

import { TTSClientBase } from '@/types/tts-client-base.type'

const REGION = 'us-east-1'

export class TTSAwsClient implements TTSClientBase {
  private readonly config: Record<string, string>
  private readonly client: PollyClient

  constructor(config: Record<string, string>) {
    this.config = config
    this.client = new PollyClient({
      region: REGION,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
    })
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
