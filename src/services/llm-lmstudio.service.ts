import { v4 as uuidv4 } from 'uuid'
import { Logger } from 'winston'
import { ChatLike, LMStudioClient } from '@lmstudio/sdk'

import { getThinkAndContent } from '@/helpers/get-think-and-content'
import { LLMClientBase, LLMInput } from '@/types/llm-client-base.type'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums'
import { SettingsSchema } from '@/schemas/settings.schema'
import { stringTemplateReplace } from '@/helpers/string-template-replace'
import {
  SUMMARY_SYSTEM_INSTRUCTIONS,
  SYSTEM_INSTRUCTIONS,
} from '@/config/constants'

export class LLMLmStudio implements LLMClientBase {
  private readonly client: LMStudioClient
  private readonly config: Record<string, string>
  private readonly settings: SettingsSchema
  private readonly logger?: Logger

  constructor(
    config: Record<string, string>,
    settings: SettingsSchema,
    logger?: Logger
  ) {
    this.config = config
    this.settings = settings
    this.client = new LMStudioClient({
      baseUrl: this.config.baseUrl,
      logger: logger?.child({ label: LMStudioClient.name }),
    })

    if (logger) {
      this.logger = logger.child({ label: LLMLmStudio.name })

      this.logger.info(
        `LLM client initialized with model: ${this.config.model}`
      )
    }
  }

  private getHistory(input: LLMInput, chatSummary?: string): ChatLike {
    return [
      {
        role: MessageRole.System,
        content: stringTemplateReplace(SYSTEM_INSTRUCTIONS, {
          ...this.settings,
          chatSummary,
        }),
      },
      ...input.map(({ role, content }) => ({ role, content })),
    ]
  }

  private getSummarizePrompt(input: LLMInput) {
    return stringTemplateReplace(SUMMARY_SYSTEM_INSTRUCTIONS, {
      chatHistory: input
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n'),
    })
  }

  async chat(input: LLMInput, chatSummary?: string): Promise<Message> {
    try {
      const model = await this.client.llm.model(this.config.model)

      const history = this.getHistory(input, chatSummary)
      const result = await model.respond(history)

      const { think, content } = getThinkAndContent(result.content || '')

      return {
        id: uuidv4(),
        role: MessageRole.Assistant,
        content: content,
        think,
      }
    } catch (error) {
      this.logger?.error(error)

      throw new Error(`${this.chat.name} error: ${error}`)
    }
  }

  async summarize(input: LLMInput): Promise<string> {
    try {
      const model = await this.client.llm.model(this.config.model)

      if (!model) {
        throw new Error(`Model ${this.config.model} not found`)
      }

      const result = await model.respond(this.getSummarizePrompt(input))

      return result.content
    } catch (error) {
      this.logger?.error(error)

      throw new Error(`${this.summarize.name} error: ${error}`)
    }
  }
}
