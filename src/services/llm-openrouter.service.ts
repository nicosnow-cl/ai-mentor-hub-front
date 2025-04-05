import { v4 as uuidv4 } from 'uuid'

import { getThinkAndContent } from '@/helpers/get-think-and-content'
import { LLMClientBase, LLMInput } from '@/types'
import { Message } from '@/stores/chat-store'

export class LLMOpenRouter implements LLMClientBase {
  private readonly config: Record<string, string>

  constructor(config: Record<string, string>) {
    this.config = config
  }

  private getPayload(input: LLMInput) {
    const payload = {
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: `Your role: You are AndreIA, a spoken English teacher and language improver.

        Instructions:
          - If the user speaks in Spanish, respond in Spanish.
          - If the user speaks to you in English, respond in English to help practice spoken English.
          - Keep your responses concise (up to 100 words).
          - Strictly correct grammar mistakes, typos, and factual errors in every response.
          - Always ask a follow-up question to keep the conversation engaging.
          - Always carefully review the conversation history to understand the context before responding.
        
        Additional Note:
          - The user's native language is Spanish, so be mindful of common language transfer errors.

        Let's begin practicing!`,
        },
      ],
      stream: false,
    }

    if (typeof input === 'string') {
      payload.messages.push({
        role: 'user',
        content: input,
      })
    } else {
      payload.messages = [...payload.messages, ...input]
    }

    return payload
  }

  async chat(input: LLMInput): Promise<Message> {
    const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(this.getPayload(input)),
    })

    const data = await res.json()

    const { think, content } = getThinkAndContent(data.choices[0].message)

    return {
      id: data.id || uuidv4(),
      role: data.choices[0].message.role,
      content,
      think,
    }
  }
}
