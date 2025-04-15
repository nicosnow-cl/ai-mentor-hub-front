import { Message } from '@/types/chats'
import { MessageRole } from '@/enums/message-role.enum'

export const getThinkAndContent = (
  message: Message
): {
  think: string
  content: string
} => {
  let think = ''
  let content = ''

  if (
    message.role === MessageRole.Assistant &&
    message.content.includes('</think>')
  ) {
    think = message.content
      .split('</think>')[0]
      .replace('<think>', '')
      .replace('</think>', '')

    content = message.content.split('</think>')[1]
  } else {
    content = message.content
  }

  return {
    think,
    content,
  }
}
