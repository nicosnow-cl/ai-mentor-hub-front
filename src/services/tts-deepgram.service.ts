import { createRequire } from "node:module";
import { DeepgramClient } from "@deepgram/sdk";

import { TTSClientBase } from "@/types";

const require = createRequire(import.meta.url);
const { createClient } = require("@deepgram/sdk");

export class TTSDeepgramClient implements TTSClientBase {
  private readonly config: Record<string, string>;
  private readonly client: DeepgramClient;

  constructor(config: Record<string, string>) {
    this.config = config;
    this.client = createClient(this.config.apiKey);
  }

  private async getAudioBuffer(stream: ReadableStream) {
    const reader = stream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
    }

    const dataArray = chunks.reduce(
      (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
      new Uint8Array(0)
    );

    return Buffer.from(dataArray.buffer);
  }

  async speech(
    text: string,
    language = "en"
  ): Promise<{ buffer: Buffer; blobType: string }> {
    const MODEL_NAME = `${this.config.model}-${this.config.voice}-${language}`;

    const response = await this.client.speak.request(
      { text },
      {
        model: MODEL_NAME,
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();

    if (!stream) {
      throw new Error("Error generating audio");
    }

    const headers = await response.getHeaders();

    return {
      buffer: await this.getAudioBuffer(stream),
      blobType: headers.get("content-type") as string,
    };
  }
}
