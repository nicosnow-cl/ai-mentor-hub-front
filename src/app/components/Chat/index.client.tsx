'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Actions } from './Actions'
import { Bubble } from './Bubble'
import { EmptyState } from './EmptyState'
import { MessageRole } from '@/enums'
import { ScalableScroll } from './ScalableScroll/index.client'
import { useChatStore } from '@/providers/chat-store-provider'

export function Chat() {
  const [ready, setReady] = useState(false)
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
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [ready, messages.length])

  return (
    <div className="fade-to-bottom z-10 w-full flex-1">
      <div
        ref={containerRef}
        className="mt-20 flex flex-col gap-y-8 overflow-y-hidden px-6 hover:overflow-y-auto md:gap-y-16 md:px-12 md:pt-40"
        style={{
          maxHeight: '65vh',
          scrollbarGutter: 'stable',
        }}
      >
        {messages.length === 0 && <EmptyState />}
        {messages.length > 10 && <Actions />}

        {ready &&
          lastTenMessages.map((message, idx) => (
            <ScalableScroll
              key={`main-chat-${message.role}-${idx}`}
              containerRef={containerRef}
            >
              <Bubble className="animate-fade-in" message={message} />
            </ScalableScroll>
          ))}
      </div>
    </div>
  )
}
