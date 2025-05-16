import { Logger } from 'winston'

import { ENV_VARS } from '@/config/environment'
import { LLMClientBase } from '@/types/llm-client-base.type'
import { LLMLmStudio } from '@/services/llm-lmstudio.service'
import { LLMOpenRouter } from '@/services/llm-openrouter.service'
import LLMConfigs from '@/config/llm.json'

// Factory class
export class LLMClientFactory {
  static create(logger?: Logger): LLMClientBase {
    const providerConfig = LLMConfigs.find(
      (providerConfig) => providerConfig.isActive
    )

    if (!providerConfig) {
      throw new Error('No LLM Provider configured')
    }

    switch (providerConfig.provider) {
      case 'openrouter':
        return new LLMOpenRouter({
          apiKey: ENV_VARS.OPENROUTER_API_KEY,
          model: providerConfig.model,
          baseUrl: providerConfig.baseUrl,
        })
      case 'lmstudio':
        return new LLMLmStudio(
          {
            model: providerConfig.model,
            baseUrl: providerConfig.baseUrl,
          },
          logger
        )
      default:
        throw new Error('Invalid LLM Provider config')
    }
  }
}

// Singleton class
export class LLMClient {
  private static instance: LLMClientBase

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = LLMClientFactory.create()
    } else {
      console.log('LLM instance already set')
    }
    return this.instance
  }
}
