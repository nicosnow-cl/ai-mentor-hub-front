'use client'

import { InteractionStatus } from '@/enums/interaction-status.enum'
import { useInteractionStore } from '@/providers/interaction-store-provider'

const getLabel = (status: InteractionStatus) => {
  switch (status) {
    case InteractionStatus.Error:
      return 'Houston, tenemos un problema.'
    case InteractionStatus.Recording:
    case InteractionStatus.STT:
      return 'Escuchando...'
    case InteractionStatus.Thinking:
      return 'Pensando...'
    case InteractionStatus.TTS:
      return 'Transcribiendo...'
    default:
      return ''
  }
}

export function InteractionStatusIndicator() {
  const { status } = useInteractionStore((store) => store)

  const label = getLabel(status)

  if (!label) {
    return null
  }

  return (
    <span
      className={`absolute -top-8 flex items-center gap-x-2 pl-3 ${
        status === InteractionStatus.Error ? 'text-red-300' : ''
      }`}
    >
      <div className="terminal-spinner" />

      <i>{label}</i>
    </span>
  )
}
