'use client'

import { IconAlertHexagonFilled } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { InteractionStatus } from '@/enums/interaction-status.enum'
import { useInteractionStore } from '@/providers/interaction-store-provider'

const getLabel = (status: InteractionStatus) => {
  switch (status) {
    case InteractionStatus.Error:
      return 'Houston, tuvimos un problema'
    case InteractionStatus.Recording:
    case InteractionStatus.STT:
      return 'Escuchando...'
    case InteractionStatus.Thinking:
      return 'Pensando...'
    case InteractionStatus.TTS:
      return 'Transcribiendo...'
    default:
      return '...'
  }
}

const getIcon = (status: InteractionStatus) => {
  if (status === InteractionStatus.Error) {
    return <IconAlertHexagonFilled />
  }

  return <div className="terminal-spinner" />
}

export function StatusIndicator() {
  const { status } = useInteractionStore((store) => store)

  const label = getLabel(status)
  const icon = getIcon(status)

  if (!label) {
    return null
  }

  return (
    <span
      className={cn(
        'glass flex w-fit items-center gap-x-2 rounded-md px-3 text-xs',
        status === InteractionStatus.Error && 'bg-slate-900/20 text-red-300'
      )}
    >
      {icon}

      <i>{label}</i>
    </span>
  )
}
