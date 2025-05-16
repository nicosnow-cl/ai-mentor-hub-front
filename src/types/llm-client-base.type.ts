import { Logger } from 'winston'

import { Message } from './chats'

export type LLMInput = string | Message[]

export type LLMClientBase = {
  logger?: Logger

  chat(input: LLMInput): Promise<Message>
}
