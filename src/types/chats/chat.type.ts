import { Message } from './message.type'

export type Chat = {
  id: string
  title: string
  topic: string
  messages: Message[]
  subTopic?: string
  createdAt?: string
  updatedAt?: string
}
