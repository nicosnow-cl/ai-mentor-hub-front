import * as AzureSDK from 'microsoft-cognitiveservices-speech-sdk'

import { getSpeechSynthesizer } from './get-azure-speech-synthesizer'
import { TTSClientBase } from '@/types'

export class TTSAzureClient implements TTSClientBase {
  private readonly config: Record<string, string>

  constructor(config: Record<string, string>) {
    this.config = config
  }

  private createClient() {
    if (!this.config.subscriptionKey) {
      throw new Error('Subscription Key is missing in the configuration.')
    }

    return getSpeechSynthesizer(this.config.subscriptionKey, this.config.voice)
  }

  private async generateASpeech(
    synthesizer: AzureSDK.SpeechSynthesizer,
    text: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (
            result.reason === AzureSDK.ResultReason.SynthesizingAudioCompleted
          ) {
            console.log('Synthesis finished.')

            const buffer = Buffer.from(result.audioData)

            resolve(buffer)
          } else {
            console.error('Speech synthesis canceled: ' + result.errorDetails)
            reject(new Error(result.errorDetails || 'Unknown error'))
          }

          synthesizer.close()
        },
        (err) => {
          console.error('Error in speech synthesis: ' + err)

          reject(err)

          synthesizer.close()
        }
      )
    })
  }

  async speech(text: string): Promise<{
    buffer: Buffer
    blobType: string
  }> {
    const synthesizer = this.createClient()

    const resultBuffer = await this.generateASpeech(synthesizer, text)

    return {
      buffer: resultBuffer,
      blobType: 'audio/wav',
    }
  }
}
