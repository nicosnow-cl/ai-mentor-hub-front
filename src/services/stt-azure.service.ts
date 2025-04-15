import { Readable } from 'stream'
import * as AzureSDK from 'microsoft-cognitiveservices-speech-sdk'
import fs from 'fs/promises'

import { blobToTempFile } from '@/helpers/blob-to-tempfile'
import { getSpeechRecognizer } from './get-azure-speech-recognizer'
import { readAndCleanTempFile } from '@/helpers/read-and-clean-tempfile'
import { STTClientBase, TranscribeResult } from '@/types/chats'
import { wavFileToPCM } from '@/helpers/wav-file-to-pcm'

export class STTAzureClient implements STTClientBase {
  private readonly config: Record<string, string>

  constructor(config: Record<string, string>) {
    this.config = config
  }

  private async generateAudioStream(audio: Blob) {
    const wavFile = await blobToTempFile(audio, '.wav')

    let pcmFile: string
    try {
      pcmFile = await wavFileToPCM(wavFile)
    } finally {
      await fs
        .unlink(wavFile)
        .catch(() => console.warn('No se pudo eliminar:', wavFile))
    }

    const pcmBuffer = await readAndCleanTempFile(pcmFile)

    return Readable.from(pcmBuffer)
  }

  private async blobToPushStream(audio: Blob) {
    const pushStream = AzureSDK.AudioInputStream.createPushStream()
    const pcmStream = await this.generateAudioStream(audio)

    for await (const chunk of pcmStream) {
      pushStream.write(chunk)
    }

    pushStream.close()

    return pushStream
  }

  private async createClient(audio: Blob) {
    if (!this.config.subscriptionKey) {
      throw new Error('Subscription Key is missing in the configuration.')
    }

    return getSpeechRecognizer(
      this.config.subscriptionKey,
      await this.blobToPushStream(audio)
    )
  }

  private async generateATranscription(
    recognizer: AzureSDK.SpeechRecognizer
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (result) => {
          console.log(JSON.stringify(result.reason, null, 2))

          if (result.reason === AzureSDK.ResultReason.RecognizedSpeech) {
            console.log('Recognition complete.')

            resolve(result.text)
          } else {
            console.error('Speech synthesis canceled: ' + result.errorDetails)
            reject(new Error(result.errorDetails || 'Unknown error'))
          }

          recognizer.close()
        },
        (err) => {
          console.error('Error in speech synthesis: ' + err)

          reject(err)

          recognizer.close()
        }
      )
    })
  }

  async transcribe(audio: Blob): Promise<TranscribeResult> {
    const recognizer = await this.createClient(audio)
    const transcribedText = await this.generateATranscription(recognizer)

    return {
      text: transcribedText,
      language: 'es',
    }
  }
}
