import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

import { Chat, Message } from '@/types/chats'

export const CHAT_STORE_KEY = 'chat-store'

export type ChatState = Chat

export type ChatActions = {
  updateTopic: (topic: string) => void
  appendMessage: (message: Message) => void
  reset: () => void
}

export type ChatStore = ChatState & ChatActions

export const defaultInitState: ChatState = {
  id: uuidv4(),
  title: 'Chat',
  messages: [],
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()(
    persist(
      (set) => ({
        ...initState,
        updateTopic: (topic: string) => {
          set((state) => ({
            ...state,
            topic,
          }))
        },
        appendMessage: (message: Message) => {
          set((state) => ({
            ...state,
            messages: [...state.messages, message],
          }))
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
