'use client'

import { Background } from './Background'
import { Blob, BlobAnimation } from './Blob'
import { cn } from '@/lib/utils'
import { InteractionStatus } from '@/enums/interaction-status.enum'
import { useInteractionStore } from '@/providers/interaction-store-provider'

const DEFAULT_COLOR = 'rgba(153, 126, 215, 1)'

const DEFAULT_GRADIENTS_COLORS = [
  'rgb(39, 133, 200) 0%, rgb(205, 133, 228) 25%, rgb(199, 174, 227) 50%, rgb(39, 134, 200) 75%, rgb(158, 94, 147) 100%',
  'rgb(158, 94, 147) 0%, rgb(244, 237, 201) 25%, rgb(64, 79, 115) 50%, rgb(158, 94, 147) 75%, rgb(38, 115, 208) 100%',
  'rgb(38, 115, 208) 0%, rgb(169, 220, 255) 25%, rgb(153, 126, 215) 50%, rgb(38, 115, 208) 75%, rgb(39, 133, 200) 100%',
]

const mapStatusToAnimation = (status: string): BlobAnimation => {
  switch (status) {
    case InteractionStatus.THINKING:
    case InteractionStatus.TTS:
      return 'struggle'
    case InteractionStatus.RECORDING_AUDIO:
    case InteractionStatus.SPEAKING:
    case InteractionStatus.STT:
      return 'beat'
    default:
      return 'default'
  }
}

export type AvatarProps = React.ComponentPropsWithoutRef<'div'> & {
  backgroundColor?: string
  gradientColors?: string[]
}

export function Avatar({
  backgroundColor = DEFAULT_COLOR,
  className,
  gradientColors = DEFAULT_GRADIENTS_COLORS,
  ...props
}: Readonly<AvatarProps>) {
  const { status } = useInteractionStore((store) => store)

  return (
    <div className={cn('relative size-64', className)} {...props}>
      <Blob animation={mapStatusToAnimation(status)} />

      <Background
        className="absolute inset-0 -z-10"
        backgroundColor={backgroundColor}
        gradientColors={gradientColors}
      />
    </div>
  )
}
