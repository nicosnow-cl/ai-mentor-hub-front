import { Message } from './message.type'

export type Chat = {
  id: string
  title: string
  messages: Message[]
  summary?: string
  createdAt?: string
  updatedAt?: string
}
