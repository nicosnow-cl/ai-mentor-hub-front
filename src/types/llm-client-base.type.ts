import { Message } from './chats'

export type LLMInput = Message[]

export type LLMClientBase = {
  chat(input: LLMInput, summary?: string): Promise<Message>
  summarize?(input: LLMInput): Promise<string>
}
