import {
  GenerateContentParameters,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  Type,
} from '@google/genai'
import { Logger } from 'winston'
import { v4 as uuidv4 } from 'uuid'

import { getThinkAndContent } from '@/helpers/get-think-and-content'
import { LLMClientBase, LLMInput } from '@/types/llm-client-base.type'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums'
import { stringToJSON } from '@/helpers/string-to-json'

export class LLMGCPClient implements LLMClientBase {
  private readonly client: GoogleGenAI
  private readonly config: Record<string, string>
  readonly logger: Logger | undefined

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config
    this.client = new GoogleGenAI({
      apiKey: this.config.apiKey,
    })

    if (logger) {
      this.logger = logger.child({ label: LLMGCPClient.name })

      this.logger.info(
        `LLM client initialized with model: ${this.config.model}`
      )
    }
  }

  private getParams(input: LLMInput): GenerateContentParameters {
    const payload = {
      model: this.config.model,
      contents: [],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: {
              type: Type.STRING,
              description: 'The generated content.',
            },
            userFollowups: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description:
                  'A list of follow-up questions or prompts for the user.',
              },
            },
          },
        },
      },
    } as GenerateContentParameters

    if (typeof input === 'string') {
      payload.contents = [
        {
          role: MessageRole.User,
          parts: [{ text: input }],
        },
      ]
    } else {
      if (payload.config && input.length > 0) {
        payload.config.systemInstruction = input[0].content
      }

      payload.contents = input
        .filter((message) => message.role !== MessageRole.System)
        .map(({ role, content }) => ({
          role,
          parts: [{ text: content }],
        }))
    }

    return payload
  }

  async chat(input: LLMInput): Promise<Message> {
    try {
      const response = await this.client.models.generateContent(
        this.getParams(input)
      )

      if (!response.text) {
        throw new Error('No response from LLM')
      }

      const { think, content } = getThinkAndContent(response.text)
      let contentObj = stringToJSON(content)

      if (!contentObj) {
        this.logger?.error('Invalid JSON response. Returning raw content.')
        this.logger?.debug(`Raw content: ${content}`)

        contentObj = {
          content,
          userFollowups: [],
        }
      }

      const { content: parsedContent, userFollowups } = contentObj

      return {
        id: response.responseId || uuidv4(),
        role: MessageRole.Assistant,
        content: parsedContent as string,
        accelerators: userFollowups as string[],
        think,
      }
    } catch (error) {
      this.logger?.error(error)

      throw new Error(`LLM error: ${error}`)
    }
  }
}
