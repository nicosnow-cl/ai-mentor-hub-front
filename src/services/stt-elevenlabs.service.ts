import { ElevenLabsClient } from 'elevenlabs'
import { Logger } from 'winston'

import { STTClientBase, TranscribeResult } from '@/types/stt-client-base.type'

export class STTElevenLabsClient implements STTClientBase {
  private readonly config: Record<string, string>
  private readonly client: ElevenLabsClient
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config
    this.client = new ElevenLabsClient({
      apiKey: config.apiKey,
    })

    if (logger) {
      this.logger = logger.child({ label: STTElevenLabsClient.name })

      this.logger.info(
        `STT client initialized with model: ${this.config.model}`
      )
    }
  }

  async transcribe(audio: Blob): Promise<TranscribeResult> {
    const transcribed = await this.client.speechToText.convert({
      file: audio,
      model_id: this.config.model, // Model to use, for now only "scribe_v1" and "scribe_v1_base" are supported
      tag_audio_events: false, // Tag audio events like laughter, applause, etc.
      // language_code: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
      // diarize: true, // Whether to annotate who is speaking
    })

    return {
      text: transcribed.text,
      language: transcribed.language_code,
    }
  }
}
