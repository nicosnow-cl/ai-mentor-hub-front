'use client'

import { InteractionStatus } from '@/enums/interaction-status.enum'
import { useInteractionStore } from '@/providers/interaction-store-provider'

const VALID_STATUS = [
  InteractionStatus.STT,
  InteractionStatus.TTS,
  InteractionStatus.Thinking,
]

export function AssistantIndicator() {
  const { status } = useInteractionStore((store) => store)

  const showAnimation = VALID_STATUS.includes(status)

  return (
    <div className="relative size-64">
      <div className="blob layer-1 animate" />
      <div className={`blob layer-2 ${showAnimation ? 'animate' : ''}`} />
      <div className={`blob layer-3 ${showAnimation ? 'animate' : ''}`} />
    </div>
  )
}
