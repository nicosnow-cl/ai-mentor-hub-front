import { Readable } from 'stream'

export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}
