'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimpleChat } from '../SimpleChat'

export function Menu() {
  return (
    <Tabs
      defaultValue="chat"
      className="flex h-full flex-col gap-y-4 overflow-hidden px-4"
    >
      <TabsList className="grow-0 justify-start">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Configuración
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="flex flex-1 overflow-hidden pb-8">
        <SimpleChat />
      </TabsContent>
      <TabsContent value="settings"></TabsContent>
    </Tabs>
  )
}
