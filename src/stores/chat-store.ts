import { createStore } from 'zustand/vanilla'
import { v4 as uuidv4 } from 'uuid'

import { Chat, Message } from '@/types/chats'
import { DEFAULT_TOPIC } from '@/config/constants'

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
  topic: localStorage.getItem(CHAT_STORE_KEY) ?? DEFAULT_TOPIC,
  subTopic: '',
  messages: [],
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    updateTopic: (topic: string) => {
      set((state) => {
        const newState = {
          ...state,
          topic,
        }

        localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(newState))

        return newState
      })
    },
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
      set((state) => {
        const resetedState = { ...defaultInitState, topic: state.topic }
        localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(resetedState))

        return resetedState
      }),
  }))
}
