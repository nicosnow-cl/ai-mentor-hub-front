import { MessageRole } from '@/enums'

export type Message = {
  id: string
  role: MessageRole
  content: string
  createdAt?: string
  think?: string
}
