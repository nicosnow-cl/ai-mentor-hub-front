import { ENV_VARS } from "@/config/environment";
import { TTSClientBase } from "@/types/tts-client-base.type";
import { TTSElevenLabsClient } from "@/services/tts-elevenlabs.service";
import { TTSMurfAiClient } from "@/services/tts-murfai.service";
import TTSConfigs from "@/config/tts.json";

export class TTSClient {
  private static instance: TTSClientBase;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      console.log("TTS Instanced already setted");

      return this.instance;
    }

    const providerConfig = TTSConfigs.find(
      (providerConfig) => providerConfig.isActive
    );

    if (!providerConfig) {
      throw new Error("Not TTS Provider configured");
    }

    switch (providerConfig.provider) {
      case "elevenlabs":
        console.log("Setting TTS ElevenLabs");

        this.instance = new TTSElevenLabsClient({
          apiKey: ENV_VARS.ELEVENLABS_API_KEY,
          model: providerConfig.model,
          voice: providerConfig.voice,
        });

        break;

      case "murf":
        console.log("Setting TTS Murf");

        this.instance = new TTSMurfAiClient({
          baseUrl: providerConfig.baseUrl as string,
          model: providerConfig.model,
          voice: providerConfig.voice,
          style: providerConfig.style as string,
        });

        break;

      default:
        throw new Error("Invalid TTS Provider config");
    }

    return this.instance;
  }
}
