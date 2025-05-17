import { Message } from './chats'

export type LLMInput = string | Message[]

export type LLMClientBase = {
  chat(input: LLMInput): Promise<Message>
}
