'use client'

import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { MENTOR_WORKING_STATUS } from '@/config/constants'
import { MessageRole } from '@/enums'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteract } from '@/app/hooks/use-send-message'
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
    })

  if (!accelerators?.length) {
    return null
  }

  return (
    <div className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2 transform">
      <div className="mx-auto flex gap-x-2">
        {accelerators.map((accelerator, idx) => (
          <Button
            key={`${accelerator}-${idx}`}
            className="glass border border-slate-500/10"
            size="sm"
            variant="ghost"
            onClick={() => handleSubmitMessage(accelerator)}
            disabled={MENTOR_WORKING_STATUS.includes(status)}
          >
            {accelerator}
          </Button>
        ))}
      </div>
    </div>
  )
}
