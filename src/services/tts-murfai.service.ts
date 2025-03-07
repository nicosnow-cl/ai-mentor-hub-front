import { TTSClientBase } from "@/types";

export class TTSMurfAiClient implements TTSClientBase {
  private readonly config: Record<string, string>;
  private readonly apiKey: string;

  constructor(config: Record<string, string>) {
    this.config = config;
    this.apiKey = process.env.MURF_API_KEY as string;
  }

  private getPayload(text: string) {
    return {
      model: this.config.model,
      voiceId: this.config.voice,
      style: this.config.style,
      text,
    };
  }

  async speech(text: string): Promise<{ buffer: Buffer; blobType: string }> {
    const res = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify(this.getPayload(text)),
    });

    const data = await res.json();

    const resAudioFile = await fetch(data.audioFile);
    const audioBlob = await resAudioFile.blob();

    return {
      buffer: Buffer.from(await audioBlob.arrayBuffer()),
      blobType: audioBlob.type,
    };
  }
}
