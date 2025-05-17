import { Logger } from 'winston'

import { ENV_VARS } from '@/config/environment'
import { TTSAWSClient } from '@/services/tts-aws.service'
import { TTSAzureClient } from '@/services/tts-azure.service'
import { TTSClientBase } from '@/types/tts-client-base.type'
import { TTSDeepgramClient } from '@/services/tts-deepgram.service'
import { TTSElevenLabsClient } from '@/services/tts-elevenlabs.service'
import { TTSGCPClient } from '@/services/tts-gcp.service'
import { TTSMurfAIClient } from '@/services/tts-murfai.service'
import { TTSProvider } from '@/enums'
import TTSConfigs from '@/config/tts.json'

const TTS_PROVIDER = ENV_VARS.TTS_PROVIDER

export class TTSClientFactory {
  static create(logger?: Logger): TTSClientBase | null {
    if (!TTS_PROVIDER) {
      return null
    }

    const providerConfig = TTSConfigs.find(
      (providerConfig) => providerConfig.provider === TTS_PROVIDER
    )

    if (!providerConfig) {
      throw new Error('No TTS Provider configured')
    }

    switch (providerConfig.provider) {
      case TTSProvider.ELEVEN_LABS:
        return new TTSElevenLabsClient(
          {
            apiKey: ENV_VARS.ELEVENLABS_API_KEY,
            model: providerConfig.model as string,
            voice: providerConfig.voice,
          },
          logger
        )

      case TTSProvider.MURF_AI:
        return new TTSMurfAIClient(
          {
            apiKey: ENV_VARS.MURF_API_KEY,
            baseUrl: providerConfig.baseUrl as string,
            model: providerConfig.model as string,
            voice: providerConfig.voice,
            style: providerConfig.style as string,
          },
          logger
        )

      case TTSProvider.DEEPGRAM:
        return new TTSDeepgramClient(
          {
            apiKey: ENV_VARS.DEEPGRAM_API_KEY,
            baseUrl: providerConfig.baseUrl as string,
            model: providerConfig.model as string,
            voice: providerConfig.voice,
          },
          logger
        )

      case TTSProvider.AWS:
        return new TTSAWSClient(
          {
            accessKey: ENV_VARS.AWS_ACCESS_KEY,
            secretKey: ENV_VARS.AWS_SECRET_KEY,
            model: providerConfig.model as string,
            voice: providerConfig.voice,
          },
          logger
        )

      case TTSProvider.AZURE:
        return new TTSAzureClient(
          {
            subscriptionKey: ENV_VARS.TTS_AZURE_SUBSCRIPTION_KEY,
            voice: providerConfig.voice,
          },
          logger
        )

      case TTSProvider.GCP:
        return new TTSGCPClient(
          {
            apiKey: ENV_VARS.TTS_GCP_API_KEY,
            voice: providerConfig.voice as string,
          },
          logger
        )

      default:
        throw new Error('No TTS Client found')
    }
  }
}

// Singleton class
export class TTSClient {
  private static instance: TTSClientBase

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      const ttsClient = TTSClientFactory.create()

      if (!ttsClient) {
        throw new Error('Cannot create TTS Client')
      }

      this.instance = ttsClient
    }

    return this.instance
  }
}
