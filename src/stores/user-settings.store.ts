import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_SETTINGS } from '@/config/constants'
import { SettingsSchema } from '@/schemas/settings.schema'

export type UserSettingsState = SettingsSchema

export type UserSettingsActions = {
  updateSettings: (settings: Partial<SettingsSchema>) => void
  resetSettings: () => void
}

export type UserSettingsStore = UserSettingsState & UserSettingsActions

export const defaultInitState: UserSettingsState =
  DEFAULT_SETTINGS as UserSettingsState

export const USER_SETTINGS_STORE_KEY = 'user-settings-store'

export const useUserSettingStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      updateSettings: (settings) =>
        set((state) => ({
          ...state,
          ...settings,
        })),
      resetSettings: () => set(() => ({ ...defaultInitState })),
    }),
    {
      name: USER_SETTINGS_STORE_KEY,
    }
  )
)
