export type TTSClientBase = {
  speech(
    text: string,
    language?: string
  ): Promise<{
    buffer: Buffer
    blobType: string
  }>
}
