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
  const { messages } = useChatStore((state) => state)
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

  return (
    <div
      className={cn(
        'z-10 w-full flex-1',
        isFirstRender ? 'animate-fade-in' : 'fade-to-bottom'
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          'mt-20 flex flex-col gap-y-8 overflow-y-hidden px-6 hover:overflow-y-auto',
          'md:gap-y-16 md:px-12 md:pt-40'
        )}
        style={{
          maxHeight: '65vh',
          scrollbarGutter: 'stable',
        }}
      >
        {messages.length > 10 && <Actions />}

        {!filteredMessages.length ? (
          <EmptyState />
        ) : (
          filteredMessages.map((message, idx) => (
            <ScalableScroll
              key={`main-chat-${message.role}-${idx}`}
              className="animate-fade-in"
              containerRef={containerRef}
            >
              <Bubble message={message} />
            </ScalableScroll>
          ))
        )}
      </div>
    </div>
  )
}
