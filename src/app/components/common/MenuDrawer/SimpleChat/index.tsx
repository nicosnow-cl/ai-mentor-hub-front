'use client'

import { useEffect, useMemo, useRef } from 'react'

import { Bubble } from '@/app/components/Chat/Bubble'
import { EmptyState } from './EmptyState'
import { useChatStore } from '@/providers/chat-store-provider'

export function SimpleChat() {
  const { messages } = useChatStore((state) => state)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredMessages = useMemo(
    () =>
      messages.filter(
        (message) => message.role === 'user' || message.role === 'assistant'
      ),
    [messages]
  )

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'instant',
      })
    }
  }, [filteredMessages.length])

  if (!filteredMessages.length) {
    return <EmptyState />
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-y-8 overflow-y-auto pr-4"
      style={{
        scrollbarGutter: 'stable',
      }}
    >
      {filteredMessages.map((message, idx) => (
        <Bubble
          key={`simple-bubble-${message.role}-${idx}`}
          message={message}
        />
      ))}
    </div>
  )
}
