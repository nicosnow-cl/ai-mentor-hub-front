import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

import { Chat, Message } from '@/types/chats'
import { llmSummarizeAct } from '@/actions/llm-summarize.action'
import { MAX_MEMORY_LENGTH } from '@/config/constants'
import { MessageRole } from '@/enums'

export const CHAT_STORE_KEY = 'chat-store'

export type ChatState = Chat

export type ChatActions = {
  appendMessage: (message: Message) => void
  resetChat: () => void
}

export type ChatStore = ChatState & ChatActions

export const defaultInitState: ChatState = {
  id: uuidv4(),
  title: 'Chat',
  messages: [],
  summary: '',
  followUps: [],
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()(
    persist(
      (set, stateFn) => ({
        ...initState,
        appendMessage: async (message: Message) => {
          set((state) => ({ messages: [...state.messages, message] }))

          const { messages } = stateFn()

          if (message.role !== MessageRole.Assistant) {
            return
          }

          if (messages.length % MAX_MEMORY_LENGTH === 0) {
            const summary = await llmSummarizeAct({ input: messages })

            if (summary) {
              set(() => ({ summary }))
            }
          }
        },
        resetChat: () => set(defaultInitState),
      }),
      {
        name: CHAT_STORE_KEY,
      }
    )
  )
}
