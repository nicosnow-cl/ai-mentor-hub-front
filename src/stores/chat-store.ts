import { createStore } from 'zustand/vanilla'
import { v4 as uuidv4 } from 'uuid'

import { Chat, Message } from '@/types/chats'

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
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    appendMessage: (message: Message) => {
      set((state) => {
        const newState = {
          ...state,
          messages: [...state.messages, message],
        }

        localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(newState))

        return newState
      })
    },
    reset: () =>
      set(() => {
        localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(defaultInitState))

        return defaultInitState
      }),
  }))
}
