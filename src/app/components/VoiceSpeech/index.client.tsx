'use client'

import { useEffect, useMemo, useState } from 'react'

import { useTtsStore } from '@/providers/tts-store-provider'

export function VoiceSpeech() {
  const [ref, setRef] = useState<HTMLAudioElement | null>()
  const { currentMessageId, audios, setAudioRef, setPlayerStatus } =
    useTtsStore((store) => store)

  const audioUrl = useMemo(() => {
    return audios?.[currentMessageId as keyof typeof audios]
  }, [currentMessageId, audios])

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
      onPlay={() => setPlayerStatus('playing')}
      onPause={() => setPlayerStatus('paused')}
      autoPlay
    >
      <source src={audioUrl} type="audio/wav" />
      Tu navegador no soporta reproducción de audio.
    </audio>
  )
}
