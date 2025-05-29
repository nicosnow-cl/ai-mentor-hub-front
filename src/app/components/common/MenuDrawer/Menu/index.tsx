'use client'

import { Button } from '@/components/ui/button'
import { Settings } from '../Settings'
import { SimpleChat } from '../SimpleChat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconX } from '@tabler/icons-react'
import { DrawerClose } from '@/components/ui/drawer'

export function Menu() {
  return (
    <Tabs
      defaultValue="chat"
      className="flex h-full flex-col gap-y-4 overflow-hidden px-2 md:px-4"
    >
      <div className="flex items-center justify-between">
        <TabsList className="justify-start">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <DrawerClose asChild>
          <Button variant="ghost" size="icon">
            <IconX className="!size-5" />
          </Button>
        </DrawerClose>
      </div>

      <TabsContent value="chat" asChild>
        <SimpleChat />
      </TabsContent>
      <TabsContent className="overflow-auto" value="settings">
        <Settings />
      </TabsContent>
    </Tabs>
  )
}
