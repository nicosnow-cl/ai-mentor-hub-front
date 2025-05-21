import { v4 as uuidv4 } from 'uuid'
import { Logger } from 'winston'

import { getThinkAndContent } from '@/helpers/get-think-and-content'
import { LLMClientBase, LLMInput } from '@/types/llm-client-base.type'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums'
import { stringToJSON } from '@/helpers/string-to-json'

export class LLMOpenRouter implements LLMClientBase {
  private readonly config: Record<string, string>
  private readonly logger?: Logger

  constructor(config: Record<string, string>, logger?: Logger) {
    this.config = config

    if (logger) {
      this.logger = logger.child({ label: LLMOpenRouter.name })

      this.logger.info(
        `LLM client initialized with model: ${this.config.model}`
      )
    }
  }

  private getPayload(input: LLMInput) {
    const payload = {
      model: this.config.model,
      messages: [],
    } as { model: string; messages: { role: MessageRole; content: string }[] }

    if (typeof input === 'string') {
      payload.messages.push({
        role: MessageRole.User,
        content: input,
      })
    } else {
      if (input.length > 0) {
        payload.messages.push({
          role: MessageRole.System,
          content: input[0].content,
        })
      }

      payload.messages.push(
        ...input
          .filter((message) => message.role !== MessageRole.System)
          .map(({ role, content }) => ({
            role,
            content,
          }))
      )
    }

    return payload
  }

  async chat(input: LLMInput): Promise<Message> {
    try {
      const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(this.getPayload(input)),
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(JSON.stringify(data.error))
      }

      const candidate = data.choices[0]?.message

      const { think, content } = getThinkAndContent(candidate?.content || '')
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
        id: data.id || uuidv4(),
        role: candidate?.role || MessageRole.Assistant,
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
