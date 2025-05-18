'use client'

import { IconAlertHexagonFilled } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { InteractionStatus } from '@/enums/interaction-status.enum'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { useChatStore } from '@/providers/chat-store-provider'

const getLabel = (status: InteractionStatus) => {
  switch (status) {
    case InteractionStatus.ERROR:
      return 'Houston, tuvimos un problema'
    case InteractionStatus.RECORDING_AUDIO:
      return 'Escuchando...'
    case InteractionStatus.STT:
      return 'Procesando...'
    case InteractionStatus.THINKING:
      return 'Pensando...'
    case InteractionStatus.TTS:
      return 'Transcribiendo...'
    default:
      return ''
  }
}

const getIcon = (status: InteractionStatus) => {
  if (status === InteractionStatus.ERROR) {
    return <IconAlertHexagonFilled />
  }

  return <div className="terminal-spinner" />
}

export function StatusIndicator() {
  const { id } = useChatStore((store) => store)
  const { status } = useInteractionStore((store) => store)

  const label = getLabel(status)
  const icon = getIcon(status)

  if (!label) {
    return null
  }

  return (
    <span
      key={`status-indicator-${id}`}
      className={cn(
        'glass flex w-fit animate-fade-in items-center gap-x-2 rounded-md px-3 text-sm',
        status === InteractionStatus.ERROR && 'bg-slate-900/20 text-red-300'
      )}
    >
      {icon}

      <i>{label}</i>
    </span>
  )
}
