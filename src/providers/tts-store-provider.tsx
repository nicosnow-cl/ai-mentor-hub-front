'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { createTtsStore, TtsStore } from '@/stores/tts-store'

export type TtsStoreApi = ReturnType<typeof createTtsStore>

export const TtsStoreContext = createContext<TtsStoreApi | undefined>(undefined)

export interface TtsStoreProviderProps {
  children: ReactNode
}

export const TtsStoreProvider = ({ children }: TtsStoreProviderProps) => {
  const storeRef = useRef<TtsStoreApi>(null)

  if (!storeRef.current) {
    storeRef.current = createTtsStore()
  }

  return (
    <TtsStoreContext.Provider value={storeRef.current}>
      {children}
    </TtsStoreContext.Provider>
  )
}

export const useTtsStore = <T,>(selector: (store: TtsStore) => T): T => {
  const ttsStoreContext = useContext(TtsStoreContext)

  if (!ttsStoreContext) {
    throw new Error(
      `${useTtsStore.name} must be used within ${TtsStoreContext.name}`
    )
  }

  return useStore(ttsStoreContext, selector)
}
