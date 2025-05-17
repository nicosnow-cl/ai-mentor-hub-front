import { Logger } from 'winston'

import { ENV_VARS } from '@/config/environment'
import { STTAWSClient } from '@/services/stt-aws.service'
import { STTAzureClient } from '@/services/stt-azure.service'
import { STTClientBase } from '@/types/stt-client-base.type'
import { STTDeepgramClient } from '@/services/stt-deepgram.service'
import { STTElevenLabsClient } from '@/services/stt-elevenlabs.service'
import { STTGCPClient } from '@/services/stt-gcp.service'
import STTConfigs from '@/config/stt.json'
import { STTProvider } from '@/enums'

const STT_PROVIDER = ENV_VARS.STT_PROVIDER

export class STTClientFactory {
  static create(logger?: Logger): STTClientBase | null {
    if (!STT_PROVIDER) {
      return null
    }

    const providerConfig = STTConfigs.find(
      (providerConfig) => providerConfig.provider === STT_PROVIDER
    )

    if (!providerConfig) {
      throw new Error('No STT Provider configured')
    }

    switch (STT_PROVIDER) {
      case STTProvider.ELEVEN_LABS:
        return new STTElevenLabsClient(
          {
            apiKey: ENV_VARS.ELEVENLABS_API_KEY,
            model: providerConfig.model as string,
          },
          logger
        )

      case STTProvider.DEEPGRAM:
        return new STTDeepgramClient(
          {
            apiKey: ENV_VARS.DEEPGRAM_API_KEY,
            baseUrl: providerConfig.baseUrl as string,
            model: providerConfig.model as string,
          },
          logger
        )

      case STTProvider.AWS:
        return new STTAWSClient(
          {
            accessKey: ENV_VARS.AWS_ACCESS_KEY,
            secretKey: ENV_VARS.AWS_SECRET_KEY,
          },
          logger
        )

      case STTProvider.AZURE:
        return new STTAzureClient(
          {
            subscriptionKey: ENV_VARS.STT_AZURE_SUBSCRIPTION_KEY,
          },
          logger
        )

      case STTProvider.GCP:
        return new STTGCPClient(
          {
            apiKey: ENV_VARS.STT_GCP_API_KEY,
            language: providerConfig.language as string,
          },
          logger
        )

      default:
        throw new Error('No STT Client found')
    }
  }
}

// Singleton class
export class STTClient {
  private static instance: STTClientBase

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      const sttClient = STTClientFactory.create()

      if (!sttClient) {
        throw new Error('Cannot create STT Client')
      }

      this.instance = sttClient
    }

    return this.instance
  }
}
