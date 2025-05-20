'use client'

import { useEffect, useMemo, useState } from 'react'

import { useTtsStore } from '@/providers/tts-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { InteractionStatus } from '@/enums'

export function VoiceSpeech() {
  const [ref, setRef] = useState<HTMLAudioElement | null>()
  const { updateStatus } = useInteractionStore((store) => store)
  const { currentMessageId, audios, setAudioRef, setPlayerStatus } =
    useTtsStore((store) => store)

  const audioUrl = useMemo(() => {
    return audios?.[currentMessageId as keyof typeof audios]
  }, [currentMessageId, audios])

  const handlePlay = () => {
    if (ref) {
      setPlayerStatus('playing')
      updateStatus(InteractionStatus.SPEAKING)
    }
  }

  const handlePause = () => {
    if (ref) {
      setPlayerStatus('paused')
      updateStatus(InteractionStatus.IDLE)
    }
  }

  const handleEnded = () => {
    if (ref) {
      setPlayerStatus('idle')
      updateStatus(InteractionStatus.IDLE)
    }
  }

  const handleError = () => {
    if (ref) {
      setPlayerStatus('idle')
    }
  }

  useEffect(() => {
    if (ref) {
      setAudioRef(ref)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  return (
    <audio
      key={currentMessageId}
      ref={(ref) => setRef(ref)}
      className="absolute hidden"
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleEnded}
      onError={handleError}
      autoPlay
    >
      <source src={audioUrl} type="audio/wav" />
      Tu navegador no soporta reproducción de audio.
    </audio>
  )
}
