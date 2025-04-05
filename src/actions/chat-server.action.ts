'use server'

import { chatServerSvc, ChatServerSvcInput } from '@/services/chat-server.post'
import { Message } from '@/stores/chat-store'

export const chatServerAct = async (
  input: ChatServerSvcInput,
  language?: string
): Promise<Message> => {
  const res = await chatServerSvc(input, language)
  const data = await res.json()

  return {
    role: data.message.role,
    content: data.message.content,
  }
}
