export type TranscribeResult = {
  text: string
  language: string
}

export type STTClientBase = {
  transcribe(audio: Blob): Promise<TranscribeResult>
}
