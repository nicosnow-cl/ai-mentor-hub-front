'use client'

import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { MENTOR_WORKING_STATUS } from '@/config/constants'
import { MessageRole } from '@/enums'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteract } from '@/app/hooks/use-interact'
import { useInteractionStore } from '@/providers/interaction-store-provider'

export function Accelerators() {
  const { messages } = useChatStore((state) => state)
  const { status } = useInteractionStore((store) => store)
  const { interact } = useInteract()

  const accelerators = useMemo(() => {
    const assistantMessages = messages.filter(
      (message) => message.role === MessageRole.Assistant
    )

    if (!assistantMessages.length) {
      return null
    }

    const { accelerators } = assistantMessages.slice(-1)[0]

    return accelerators
  }, [messages])

  const handleSubmitMessage = (message: string) =>
    interact({
      id: uuidv4(),
      role: MessageRole.User,
      content: message,
      createdAt: new Date().toISOString(),
    })

  if (!accelerators?.length) {
    return null
  }

  return (
    <div className="mx-auto flex flex-wrap justify-center gap-1">
      {accelerators.map((accelerator, idx) => (
        <Button
          key={`${accelerator}-${idx}`}
          type="button"
          className="glass overflow-ellipsis border border-slate-400/10"
          size="sm"
          variant="ghost"
          onClick={() => handleSubmitMessage(accelerator)}
          disabled={MENTOR_WORKING_STATUS.includes(status)}
        >
          {accelerator}
        </Button>
      ))}
    </div>
  )
}
