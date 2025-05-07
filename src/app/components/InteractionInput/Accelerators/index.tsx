'use client'

import { Button } from '@/components/ui/button'
import { MessageRole } from '@/enums'
import { useChatStore } from '@/providers/chat-store-provider'
import { useMemo } from 'react'

export function Accelerators() {
  const { messages } = useChatStore((state) => state)
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
          >
            {accelerator}
          </Button>
        ))}
      </div>
    </div>
  )
}
