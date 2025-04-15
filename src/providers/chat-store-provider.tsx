'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { CHAT_STORE_KEY, ChatStore, createChatStore } from '@/stores/chat-store'

export type ChatStoreApi = ReturnType<typeof createChatStore>

export const ChatStoreContext = createContext<ChatStoreApi | undefined>(
  undefined
)

export interface ChatStoreProviderProps {
  children: ReactNode
}

export const ChatStoreProvider = ({ children }: ChatStoreProviderProps) => {
  const storeRef = useRef<ChatStoreApi>(null)

  if (!storeRef.current) {
    const storedState = localStorage.getItem(CHAT_STORE_KEY)

    if (storedState) {
      const parsedState = JSON.parse(storedState)

      storeRef.current = createChatStore(parsedState)
    } else {
      const chatStore = createChatStore()

      localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(chatStore.getState()))

      storeRef.current = chatStore
    }
  }

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatStoreContext.Provider>
  )
}

export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const chatStoreContext = useContext(ChatStoreContext)

  if (!chatStoreContext) {
    throw new Error(`useChatStore must be used within ChatStoreContext`)
  }

  return useStore(chatStoreContext, selector)
}
