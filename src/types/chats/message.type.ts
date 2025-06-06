import { MessageRole } from '@/enums'

export type Message = {
  id: string
  role: MessageRole
  content: string
  error?: string
  createdAt?: string
  think?: string
}
