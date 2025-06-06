import { Logger } from 'winston'

import { DEFAULT_SETTINGS } from '@/config/constants'
import { ENV_VARS } from '@/config/environment'
import { LLMClientBase } from '@/types/llm-client-base.type'
import { LLMGCPClient } from '@/services/llm-gcp.service'
import { LLMLmStudio } from '@/services/llm-lmstudio.service'
import { LLMOpenRouter } from '@/services/llm-openrouter.service'
import { LLMProvider } from '@/enums'
import { SettingsSchema } from '@/schemas/settings.schema'
import LLMConfigs from '@/config/llm.json'

const LLM_PROVIDER = ENV_VARS.LLM_PROVIDER

export class LLMClientFactory {
  static create(
    logger?: Logger,
    settings: SettingsSchema = DEFAULT_SETTINGS as SettingsSchema
  ): LLMClientBase | null {
    if (!LLM_PROVIDER) {
      return null
    }

    const providerConfig = LLMConfigs.find(
      (providerConfig) => providerConfig.provider === LLM_PROVIDER
    )

    if (!providerConfig) {
      throw new Error('No LLM Provider configured')
    }

    switch (LLM_PROVIDER) {
      case LLMProvider.OPEN_ROUTER: {
        const config = {
          apiKey: ENV_VARS.OPENROUTER_API_KEY,
          model: providerConfig.model,
          baseUrl: providerConfig.baseUrl as string,
        } as const

        return new LLMOpenRouter(config, settings, logger)
      }

      case LLMProvider.LM_STUDIO: {
        const config = {
          model: providerConfig.model,
          baseUrl: providerConfig.baseUrl as string,
        } as const

        return new LLMLmStudio(config, settings, logger)
      }

      case LLMProvider.GCP: {
        const config = {
          apiKey: ENV_VARS.LLM_GCP_API_KEY,
          model: providerConfig.model,
        } as const

        return new LLMGCPClient(config, settings, logger)
      }

      default:
        throw new Error('No LLM Client found')
    }
  }
}

// Singleton class
export class LLMClient {
  private static instance: LLMClientBase

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      const llmClient = LLMClientFactory.create()

      if (!llmClient) {
        throw new Error('Cannot create LLM Client')
      }

      this.instance = llmClient
    }

    return this.instance
  }
}
