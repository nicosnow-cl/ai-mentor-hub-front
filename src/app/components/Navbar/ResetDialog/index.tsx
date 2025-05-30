'use client'

import { IconRefresh } from '@tabler/icons-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/providers/chat-store-provider'
import { useFollowUpsStore } from '@/stores/follow-ups.store'

export function ResetDialog() {
  const { messages, resetChat } = useChatStore((state) => state)
  const { resetFollowUps } = useFollowUpsStore((state) => state)

  const resetStores = () => {
    resetChat()
    resetFollowUps()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className="ml-auto"
          variant="ghost"
          size="icon"
          disabled={messages.length <= 1}
        >
          <IconRefresh />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reiniciar la conversación</AlertDialogTitle>
          <AlertDialogDescription>
            Al reiniciar la conversación se eliminarán todos los mensajes y
            respuestas anteriores. Al hacer esto, no podrás volver a ver la
            conversación anterior.
            <b>¿Quieres continuar?</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={resetStores}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
