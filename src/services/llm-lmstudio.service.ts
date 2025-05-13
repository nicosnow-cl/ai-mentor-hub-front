import { v4 as uuidv4 } from 'uuid'

import { getThinkAndContent } from '@/helpers/get-think-and-content'
import { LLMClientBase, LLMInput } from '@/types/llm-client-base.type'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums'
import { stringToJSON } from '@/helpers/string-to-json'

export class LLMLmStudio implements LLMClientBase {
  private readonly config: Record<string, string>

  constructor(config: Record<string, string>) {
    this.config = config
  }

  private getPayload(input: LLMInput) {
    const payload = {
      model: this.config.model,
      messages: [],
      stream: false,
    } as { model: string; messages: Array<Partial<Message>>; stream: boolean }

    if (typeof input === 'string') {
      payload.messages.push({ role: MessageRole.User, content: input })
    } else {
      payload.messages = [...payload.messages, ...input]
    }

    return payload
  }

  async chat(input: LLMInput): Promise<Message> {
    const res = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(this.getPayload(input)),
    })

    const data = await res.json()

    if (data.error) {
      throw new Error(data.error)
    }

    const { think, content } = getThinkAndContent(data.choices[0].message)
    let contentObj = stringToJSON(content)

    if (!contentObj) {
      console.error('Invalid JSON response')

      contentObj = {
        content,
        userFollowups: [],
      }
    }

    const { content: parsedContent, userFollowups } = contentObj

    return {
      id: data.id || uuidv4(),
      role: data.choices[0].message.role || MessageRole.Assistant,
      content: parsedContent as string,
      accelerators: userFollowups as string[],
      think,
    }
  }
}
