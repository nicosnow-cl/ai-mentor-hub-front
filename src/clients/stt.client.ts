import { ENV_VARS } from "@/config/environment";
import { STTAwsClient } from "@/services/stt-aws.service";
import { STTAzureClient } from "@/services/stt-azure.service";
import { STTClientBase } from "@/types";
import { STTDeepgramClient } from "@/services/stt-deepgram.service";
import { STTElevenLabsClient } from "@/services/stt-elevenlabs.service";
import STTConfigs from "@/config/stt.json";

export class STTClient {
  private static instance: STTClientBase;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      console.log("STT Instanced already setted");

      return this.instance;
    }

    const providerConfig = STTConfigs.find(
      (providerConfig) => providerConfig.isActive
    );

    if (!providerConfig) {
      throw new Error("No STT Provider configured");
    }

    switch (providerConfig.provider) {
      case "elevenlabs":
        console.log("Setting STT ElevenLabs");

        this.instance = new STTElevenLabsClient({
          apiKey: ENV_VARS.ELEVENLABS_API_KEY,
          model: providerConfig.model as string,
        });

        break;

      case "deepgram":
        console.log("Setting STT DeepGram");

        this.instance = new STTDeepgramClient({
          apiKey: ENV_VARS.DEEPGRAM_API_KEY,
          baseUrl: providerConfig.baseUrl as string,
          model: providerConfig.model as string,
        });

        break;

      case "aws":
        console.log("Setting STT AWS");

        this.instance = new STTAwsClient({
          accessKey: ENV_VARS.AWS_ACCESS_KEY,
          secretKey: ENV_VARS.AWS_SECRET_KEY,
        });

        break;

      case "azure":
        console.log("Setting STT Azure");

        this.instance = new STTAzureClient({
          subscriptionKey: ENV_VARS.STT_AZURE_SUBSCRIPTION_KEY,
        });

        break;

      default:
        throw new Error("Invalid STT Provider config");
    }

    return this.instance;
  }
}
