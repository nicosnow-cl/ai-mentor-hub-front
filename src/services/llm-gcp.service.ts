import {
  GenerateContentParameters,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  Modality,
} from '@google/genai'
import { Logger } from 'winston'
import { v4 as uuidv4 } from 'uuid'

import {
  FOLLOW_UPS_SYSTEM_INSTRUCTIONS,
  SUMMARY_SYSTEM_INSTRUCTIONS,
  SYSTEM_INSTRUCTIONS,
} from '@/config/constants'
import { getThinkAndContent } from '@/helpers/get-think-and-content'
import { LLMClientBase, LLMInput } from '@/types/llm-client-base.type'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums'
import { parseLLMStrToJSON } from '@/helpers/parse-llm-str-to-json'
import { SettingsSchema } from '@/schemas/settings.schema'
import { stringTemplateReplace } from '@/helpers/string-template-replace'

export class LLMGCPClient implements LLMClientBase {
  private readonly client: GoogleGenAI
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
    this.client = new GoogleGenAI({ apiKey: this.config.apiKey })

    if (logger) {
      this.logger = logger.child({ label: LLMGCPClient.name })

      this.logger.info(
        `LLM client initialized with model: ${this.config.model}`
      )
    }
  }

  private getGeminiParams(
    input: LLMInput,
    chatSummary?: string
  ): GenerateContentParameters {
    return {
      model: this.config.model,
      contents: input.map(({ role, content }) => ({
        role,
        parts: [{ text: content }],
      })),
      config: {
        responseModalities: [Modality.TEXT],
        systemInstruction: stringTemplateReplace(SYSTEM_INSTRUCTIONS, {
          ...this.settings,
          chatSummary,
        }),
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      },
    }
  }

  private getGemmaParams(
    input: LLMInput,
    chatSummary?: string
  ): GenerateContentParameters {
    return {
      model: this.config.model,
      contents: [
        {
          role: 'model',
          parts: [
            {
              text: stringTemplateReplace(SYSTEM_INSTRUCTIONS, {
                ...this.settings,
                chatSummary,
              }),
            },
          ],
        },
        ...input.map(({ role, content }) => ({
          role: role !== MessageRole.User ? 'model' : role,
          parts: [{ text: content }],
        })),
      ],
      config: {
        responseModalities: [Modality.TEXT],
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      },
    }
  }

  private getChatParams(
    input: LLMInput,
    chatSummary?: string
  ): GenerateContentParameters {
    return this.config.model.startsWith('gemini')
      ? this.getGeminiParams(input, chatSummary)
      : this.getGemmaParams(input, chatSummary)
  }

  private getSummarizeParams(input: LLMInput) {
    return {
      model: this.config.model,
      contents: stringTemplateReplace(SUMMARY_SYSTEM_INSTRUCTIONS, {
        chatHistory: input
          .map((message) => `${message.role}: ${message.content}`)
          .join('\n'),
      }),
      config: {
        responseModalities: [Modality.TEXT],
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      },
    }
  }

  private getFollowupsParams(input: LLMInput) {
    return {
      model: this.config.model,
      contents: stringTemplateReplace(FOLLOW_UPS_SYSTEM_INSTRUCTIONS, {
        chatHistory: input
          .map((message) => `${message.role}: ${message.content}`)
          .join('\n'),
      }),
      config: {
        responseModalities: [Modality.TEXT],
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      },
    }
  }

  async chat(input: LLMInput, chatSummary?: string): Promise<Message> {
    try {
      const response = await this.client.models.generateContent(
        this.getChatParams(input, chatSummary)
      )

      if (!response.text) {
        throw new Error('No response from LLM')
      }

      const { think, content } = getThinkAndContent(response.text)

      return {
        id: response.responseId || uuidv4(),
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
      const response = await this.client.models.generateContent(
        this.getSummarizeParams(input)
      )

      return response.text || ''
    } catch (error) {
      this.logger?.error(error)

      throw new Error(`${this.summarize.name} error: ${error}`)
    }
  }

  async getFollowups(input: LLMInput): Promise<string[]> {
    try {
      const response = await this.client.models.generateContent(
        this.getFollowupsParams(input)
      )

      if (!response.text) {
        throw new Error('No response from LLM')
      }

      const { content } = getThinkAndContent(response.text)

      return parseLLMStrToJSON<string[]>(content) || []
    } catch (error) {
      this.logger?.error(error)

      throw new Error(`${this.getFollowups.name} error: ${error}`)
    }
  }
}
