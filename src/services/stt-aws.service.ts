import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  StartStreamTranscriptionCommandInput,
} from '@aws-sdk/client-transcribe-streaming'
import fs from 'fs/promises'

import { blobToTempFile } from '@/helpers/blob-to-tempfile'
import { Readable } from 'stream'
import { readAndCleanTempFile } from '@/helpers/read-and-clean-tempfile'
import { splitBuffer } from '@/helpers/split-buffer'
import { STTClientBase, TranscribeResult } from '@/types/chats'
import { wavFileToPCM } from '@/helpers/wav-file-to-pcm'

const REGION = 'us-east-1'

export class STTAwsClient implements STTClientBase {
  private readonly config: Record<string, string>
  private readonly client: TranscribeStreamingClient

  constructor(config: Record<string, string>) {
    this.config = config
    this.client = new TranscribeStreamingClient({
      region: REGION,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
    })
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

    return Readable.from(splitBuffer(pcmBuffer, 8000))
  }

  private async getParams(
    audio: Blob
  ): Promise<StartStreamTranscriptionCommandInput> {
    const audioStream = await this.generateAudioStream(audio)

    // Configurar el comando para iniciar la transcripción
    return {
      LanguageCode: 'es-US', // Cambia el idioma si es necesario
      MediaEncoding: 'pcm', // AWS Transcribe necesita audio PCM sin compresión
      MediaSampleRateHertz: 16000,
      AudioStream: (async function* () {
        for await (const chunk of audioStream) {
          console.log('Enviando chunk de audio:', chunk.length, 'bytes')

          yield {
            AudioEvent: {
              AudioChunk: chunk,
            },
          }
        }
      })(),
    }
  }

  async transcribe(audio: Blob): Promise<TranscribeResult> {
    const params = await this.getParams(audio)

    const response = await this.client.send(
      new StartStreamTranscriptionCommand(params)
    )

    if (!response?.TranscriptResultStream) {
      throw new Error('Error tanscribing audio')
    }

    let transcribed = ''
    for await (const event of response.TranscriptResultStream) {
      if (event.TranscriptEvent) {
        const results = event.TranscriptEvent.Transcript?.Results ?? []

        for (const result of results) {
          if (!result.IsPartial) {
            const transcriptText = result.Alternatives?.[0].Transcript

            if (transcriptText) {
              console.log('Transcripción:', transcriptText)

              transcribed += transcriptText + ' '
            }
          }
        }
      }
    }

    return {
      text: transcribed.trim(),
      language: 'es',
    }
  }
}
