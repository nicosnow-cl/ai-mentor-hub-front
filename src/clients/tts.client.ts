import { ENV_VARS } from '@/config/environment'
import { TTSAwsClient } from '@/services/tts-aws.service'
import { TTSAzureClient } from '@/services/tts-azure.service'
import { TTSClientBase } from '@/types/tts-client-base.type'
import { TTSDeepgramClient } from '@/services/tts-deepgram.service'
import { TTSElevenLabsClient } from '@/services/tts-elevenlabs.service'
import { TTSGCPClient } from '@/services/tts-gcp.service'
import { TTSMurfAiClient } from '@/services/tts-murfai.service'
import TTSConfigs from '@/config/tts.json'

export class TTSClient {
  private static instance: TTSClientBase

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      console.log('TTS Instanced already setted')

      return this.instance
    }

    const providerConfig = TTSConfigs.find(
      (providerConfig) => providerConfig.isActive
    )

    if (!providerConfig) {
      throw new Error('Not TTS Provider configured')
    }

    switch (providerConfig.provider) {
      case 'elevenlabs':
        console.log('Setting TTS ElevenLabs')

        this.instance = new TTSElevenLabsClient({
          apiKey: ENV_VARS.ELEVENLABS_API_KEY,
          model: providerConfig.model as string,
          voice: providerConfig.voice,
        })

        break

      case 'murf':
        console.log('Setting TTS Murf')

        this.instance = new TTSMurfAiClient({
          apiKey: ENV_VARS.MURF_API_KEY,
          baseUrl: providerConfig.baseUrl as string,
          model: providerConfig.model as string,
          voice: providerConfig.voice,
          style: providerConfig.style as string,
        })

        break

      case 'deepgram':
        console.log('Setting TTS Deepgram')

        this.instance = new TTSDeepgramClient({
          apiKey: ENV_VARS.DEEPGRAM_API_KEY,
          baseUrl: providerConfig.baseUrl as string,
          model: providerConfig.model as string,
          voice: providerConfig.voice,
        })

        break

      case 'aws':
        console.log('Setting TTS AWS')

        this.instance = new TTSAwsClient({
          accessKey: ENV_VARS.AWS_ACCESS_KEY,
          secretKey: ENV_VARS.AWS_SECRET_KEY,
          model: providerConfig.model as string,
          voice: providerConfig.voice,
        })

        break

      case 'azure':
        console.log('Setting TTS Azure')

        this.instance = new TTSAzureClient({
          subscriptionKey: ENV_VARS.TTS_AZURE_SUBSCRIPTION_KEY,
          voice: providerConfig.voice,
        })

        break

      case 'gcp':
        console.log('Setting TTS GCP')

        this.instance = new TTSGCPClient({
          apiKey: ENV_VARS.TTS_GCP_API_KEY,
          voice: providerConfig.voice as string,
        })

        break

      default:
        throw new Error('Invalid TTS Provider config')
    }

    return this.instance
  }
}
