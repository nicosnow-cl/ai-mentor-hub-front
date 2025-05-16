import { SpeechClient, protos } from '@google-cloud/speech'

import { STTClientBase, TranscribeResult } from '@/types/stt-client-base.type'

export class STTGCPClient implements STTClientBase {
  private readonly config: Record<string, string>
  private readonly client: SpeechClient

  constructor(config: Record<string, string>) {
    this.config = config

    this.client = new SpeechClient({
      apiKey: config.apiKey,
    })
  }

  getTranscription(response: protos.google.cloud.speech.v1.IRecognizeResponse) {
    if (!response.results || response.results.length === 0) {
      throw new Error('No transcription results')
    }

    return response.results
      .map((result) => result.alternatives?.[0].transcript)
      .join('\n')
  }

  async getParams(
    audio: Blob
  ): Promise<protos.google.cloud.speech.v1.IRecognizeRequest> {
    return {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: this.config.language,
      },
      audio: {
        content: Buffer.from(await audio.arrayBuffer()),
      },
    }
  }

  async transcribe(audio: Blob): Promise<TranscribeResult> {
    const params = await this.getParams(audio)
    const [response] = await this.client.recognize(params)

    if (!response.results || response.results.length === 0) {
      throw new Error('No transcription results')
    }

    const transcription = this.getTranscription(response)

    return {
      text: transcription,
      language: '',
    }
  }
}
