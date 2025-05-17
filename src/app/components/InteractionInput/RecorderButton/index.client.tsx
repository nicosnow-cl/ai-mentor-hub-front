'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from './Button'
import { cn } from '@/lib/utils'
import { InteractionStatus } from '@/enums/interaction-status.enum'
import { MENTOR_WORKING_STATUS } from '@/config/constants'
import { MessageRole } from '@/enums'
import { useInteract } from '@/app/hooks/use-send-message'
import { useInteractionStore } from '@/providers/interaction-store-provider'

export function RecorderButton() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { interact, transcribeAudio } = useInteract()
  const { status, updateStatus } = useInteractionStore((store) => store)

  const startRecording = async () => {
    updateStatus(InteractionStatus.Recording)

    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach((audioElem) => audioElem.pause())

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const recorder = new MediaRecorder(stream)

    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }

    recorder.onstop = async () => {
      try {
        const blob = new Blob(chunks, {
          type: 'audio/webm',
        })

        const transcribedText = await transcribeAudio(blob)

        if (!transcribedText) {
          throw new Error('Transcription failed')
        }

        interact({
          id: uuidv4(),
          role: MessageRole.User,
          content: transcribedText.text,
        })
      } catch (err: unknown) {
        console.error(err)

        updateStatus(InteractionStatus.Error)
      }
    }

    recorder.start()

    setMediaRecorder(recorder)
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const handleStart = () => {
    if (!MENTOR_WORKING_STATUS.includes(status)) {
      startRecording()
    }
  }

  const handleStop = () => {
    stopRecording()
  }

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault()
    handleStart()
  }

  const handlePointerUp = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault()
    handleStop()
  }

  return (
    <Button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onTouchCancel={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      isActive={status === InteractionStatus.Recording}
      disabled={MENTOR_WORKING_STATUS.includes(status)}
      aria-pressed={status === InteractionStatus.Recording}
      className={cn(
        'recorder-button',
        status === InteractionStatus.Recording && 'active'
      )}
    ></Button>
  )
}
