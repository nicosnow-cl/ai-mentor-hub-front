import { Logger } from 'winston'
import { v4 as uuidv4 } from 'uuid'
import OpenAI from 'openai'

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

export class LLMOpenRouter implements LLMClientBase {
  private readonly client: OpenAI
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
    this.client = new OpenAI({
      baseURL: this.config.baseUrl,
      apiKey: this.config.apiKey,
    })

    if (logger) {
      this.logger = logger.child({ label: LLMOpenRouter.name })

      this.logger.info(
        `LLM client initialized with model: ${this.config.model}`
      )
    }
  }

  private getChatParams(
    input: LLMInput,
    chatSummary?: string
  ): OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming {
    return {
      model: this.config.model,
      messages: [
        {
          role: MessageRole.System,
          content: stringTemplateReplace(SYSTEM_INSTRUCTIONS, {
            ...this.settings,
            chatSummary,
          }),
        },
        ...input.map(({ role, content }) => ({
          role,
          content,
        })),
      ],
    }
  }

  private getSummarizeParams(input: LLMInput) {
    return {
      model: this.config.model,
      prompt: stringTemplateReplace(SUMMARY_SYSTEM_INSTRUCTIONS, {
        chatHistory: input
          .map((message) => `${message.role}: ${message.content}`)
          .join('\n'),
      }),
    }
  }

  async chat(input: LLMInput, chatSummary?: string): Promise<Message> {
    try {
      const completion = await this.client.chat.completions.create(
        this.getChatParams(input, chatSummary)
      )

      const candidate = completion.choices[0]?.message

      const { think, content } = getThinkAndContent(candidate?.content || '')

      return {
        id: completion.id || uuidv4(),
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
      const completion = await this.client.completions.create(
        this.getSummarizeParams(input)
      )

      return completion.choices[0]?.text || ''
    } catch (error) {
      this.logger?.error(error)

      throw new Error(`${this.summarize.name} error: ${error}`)
    }
  }
}
