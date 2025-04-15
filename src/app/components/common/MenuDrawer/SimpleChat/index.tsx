'use client'

import { useEffect, useRef } from 'react'

import { Bubble } from '@/app/components/Chat/Bubble'
import { useChatStore } from '@/providers/chat-store-provider'

export function SimpleChat() {
  const { messages } = useChatStore((state) => state)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages.length])

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-y-8 overflow-y-auto pr-4"
      style={{
        scrollbarGutter: 'stable',
      }}
    >
      {messages.map((message, idx) => (
        <Bubble
          key={`simple-bubble-${message.role}-${idx}`}
          message={message}
        />
      ))}
    </div>
  )
}
