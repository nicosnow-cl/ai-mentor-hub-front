import { Message } from './message.type'

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt?: string
  updatedAt?: string
}
