'use client'

import { useEffect, useMemo, useRef } from 'react'

import { Bubble } from './Bubble'
import { Button } from '@/components/ui/button'
import { EmptyState } from './EmptyState'
import { MessageRole } from '@/enums'
import { ScalableScroll } from './ScalableScroll/index.client'
import { useChatStore } from '@/providers/chat-store-provider'

export function Chat() {
  const { messages } = useChatStore((state) => state)
  const containerRef = useRef<HTMLDivElement>(null)

  const lastTenMessages = useMemo(
    () =>
      messages
        .filter((message) => message.role !== MessageRole.System)
        .slice(Math.max(messages.length - 10, 0)),
    [messages]
  )

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages.length])

  return (
    <div className="fade-to-bottom z-10 w-full flex-1">
      <div
        ref={containerRef}
        className="mt-20 flex flex-col gap-y-8 overflow-y-auto px-6 md:gap-y-16 md:px-12 md:pt-40"
        style={{
          maxHeight: '65vh',
          scrollbarGutter: 'stable',
        }}
      >
        {lastTenMessages.length === 0 && <EmptyState />}
        {messages.length > 10 && <Button variant="ghost">Ver más</Button>}

        {lastTenMessages.map((message, idx) => (
          <ScalableScroll
            key={`bubble-${message.role}-${idx}`}
            containerRef={containerRef}
            className="animate-fade-in"
          >
            <Bubble message={message} />
          </ScalableScroll>
        ))}
      </div>
    </div>
  )
}
