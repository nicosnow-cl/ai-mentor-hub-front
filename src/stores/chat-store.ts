import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

import { Chat, Message } from '@/types/chats'
import { llmSummarizeAct } from '@/actions/llm-summarize.action'

export const CHAT_STORE_KEY = 'chat-store'

export type ChatState = Chat

export type ChatActions = {
  appendMessage: (message: Message) => void
  reset: () => void
}

export type ChatStore = ChatState & ChatActions

export const defaultInitState: ChatState = {
  id: uuidv4(),
  title: 'Chat',
  messages: [],
  summary: '',
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()(
    persist(
      (set, stateFn) => ({
        ...initState,
        appendMessage: async (message: Message) => {
          set((state) => ({
            messages: [...state.messages, message],
          }))

          if (message.role === 'assistant') {
            const summary = await llmSummarizeAct({
              input: stateFn().messages,
            })

            if (summary) {
              set(() => ({
                summary,
              }))
            }
          }
        },
        reset: () =>
          set(() => ({
            ...defaultInitState,
          })),
      }),
      {
        name: CHAT_STORE_KEY,
      }
    )
  )
}
