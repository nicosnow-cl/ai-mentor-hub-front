import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { llmFollowUpsAct } from '@/actions/llm-followups.action'
import { Message } from '@/types/chats'

export type FollowUpsState = {
  messageId: string
  followUps: string[]
  isLoading: boolean
}

export type FollowUpsActions = {
  generateFollowUps: (messageId: string, messages: Message[]) => void
  resetFollowUps: () => void
}

export type FollowUpsStore = FollowUpsState & FollowUpsActions

export const defaultInitState: FollowUpsState = {
  messageId: '',
  followUps: [],
  isLoading: false,
}

export const FOLLOW_UPS_STORE_KEY = 'follow-ups-store'

export const useFollowUpsStore = create<FollowUpsStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      generateFollowUps: async (messageId, messages) => {
        try {
          set(() => ({ isLoading: true, messageId }))

          const followUps = await llmFollowUpsAct({
            input: messages,
          })

          if (Array.isArray(followUps) && followUps.length > 0) {
            set(() => ({ followUps }))
          }
        } catch (error) {
          console.error('Error generating follow-ups:', error)
        } finally {
          set(() => ({ isLoading: false }))
        }
      },
      resetFollowUps: () => set(defaultInitState),
    }),
    {
      name: FOLLOW_UPS_STORE_KEY,
    }
  )
)
