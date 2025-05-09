'use client'

import { ChatStoreProvider } from './chat-store-provider'
import { InteractionStoreProvider } from './interaction-store-provider'
import { MenuDrawerProvider } from './menu-drawer.provider'
import { ThemeProvider } from './theme.provider'
import { TtsStoreProvider } from './tts-store-provider'

export type RootProviderProps = {
  children: React.ReactNode
}

export function RootProvider({ children }: Readonly<RootProviderProps>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TtsStoreProvider>
        <ChatStoreProvider>
          <InteractionStoreProvider>
            <MenuDrawerProvider>{children}</MenuDrawerProvider>
          </InteractionStoreProvider>
        </ChatStoreProvider>
      </TtsStoreProvider>
    </ThemeProvider>
  )
}
