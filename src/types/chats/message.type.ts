import { MessageRole } from '@/enums'

export type Message = {
  id: string
  role: MessageRole
  content: string
  accelerators?: string[]
  createdAt?: string
  think?: string
}
