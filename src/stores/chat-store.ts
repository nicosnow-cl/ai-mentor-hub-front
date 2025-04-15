import { createStore } from 'zustand/vanilla'
import { v4 as uuidv4 } from 'uuid'

import {
  DEFAULT_MENTOR_LANGUAGE,
  DEFAULT_MENTOR_NAME,
  DEFAULT_SYSTEM_INSTRUCTIONS,
  DEFAULT_TOPIC,
} from '@/config/constants'
import { Chat, Message } from '@/types/chats'
import { MessageRole } from '@/enums'
import { stringTemplateReplace } from '@/helpers/string-template-replace'

export const CHAT_STORE_KEY = 'chat-store'

const SYSTEM_INSTRUCTIONS = {
  id: uuidv4(),
  role: MessageRole.System,
  content: stringTemplateReplace(DEFAULT_SYSTEM_INSTRUCTIONS, {
    name: DEFAULT_MENTOR_NAME,
    language: DEFAULT_MENTOR_LANGUAGE,
    topic: DEFAULT_TOPIC,
  }),
}

export type ChatState = Chat

export type ChatActions = {
  appendMessage: (message: Message) => void
  reset: () => void
}

export type ChatStore = ChatState & ChatActions

export const defaultInitState: ChatState = {
  id: uuidv4(),
  title: 'Chat',
  messages: [SYSTEM_INSTRUCTIONS],
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
