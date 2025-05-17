'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useIsFirstRender } from '@uidotdev/usehooks'

import { Actions } from './Actions'
import { Bubble } from './Bubble'
import { cn } from '@/lib/utils'
import { EmptyState } from './EmptyState'
import { MessageRole } from '@/enums'
import { ScalableScroll } from './ScalableScroll/index.client'
import { useChatStore } from '@/providers/chat-store-provider'

export function Chat() {
  const { id, messages } = useChatStore((state) => state)
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useIsFirstRender()

  const filteredMessages = useMemo(
    () =>
      messages
        .filter((message) => message.role !== MessageRole.System)
        .slice(-10),
    [messages]
  )

  // Lógica de scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  if (!filteredMessages.length) {
    return (
      <div className="z-10 grid size-full place-items-center">
        <EmptyState />
      </div>
    )
  }

  return (
    <div
      key={`main-chat-${id}`}
      className={cn(
        'z-10 size-full',
        isFirstRender ? 'animate-fade-in' : 'fade-to-bottom'
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          'flex size-full max-h-[calc(100dvh-20rem)] flex-col gap-y-8 overflow-y-auto px-6 pt-20 md:overflow-y-hidden md:hover:overflow-y-auto',
          'md:gap-y-16 md:px-12'
        )}
        style={{
          scrollbarGutter: 'stable',
        }}
      >
        {messages.length > 10 && <Actions />}

        {filteredMessages.map((message, idx) => (
          <ScalableScroll
            key={`main-chat-${message.role}-${idx}`}
            className="animate-fade-in"
            containerRef={containerRef}
          >
            <Bubble message={message} />
          </ScalableScroll>
        ))}
      </div>
    </div>
  )
}
