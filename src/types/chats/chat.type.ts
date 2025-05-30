import { Message } from './message.type'

export type Chat = {
  id: string
  title: string
  messages: Message[]
  summary?: string
  followUps?: string[]
  createdAt?: string
  updatedAt?: string
}
