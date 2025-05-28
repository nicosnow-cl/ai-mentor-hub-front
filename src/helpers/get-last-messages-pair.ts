import { MessageRole } from '@/enums'
import { Message } from '@/types/chats'

export const getLastMessagePairs = (messages: Message[], pairCount = 4) => {
  const pairs = []
  let i = messages.length - 1

  while (i > 0 && pairs.length < pairCount) {
    const current = messages[i]
    const previous = messages[i - 1]

    if (
      (previous.role === MessageRole.User &&
        current.role === MessageRole.Assistant) ||
      (previous.role === MessageRole.Assistant &&
        current.role === MessageRole.User)
    ) {
      pairs.unshift(previous, current)
      i -= 2
    } else {
      i--
    }
  }

  return pairs
}
