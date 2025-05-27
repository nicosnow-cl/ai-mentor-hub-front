'use client'

import { IconMicrophone, IconTrash } from '@tabler/icons-react'
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from './Button'
import { cn } from '@/lib/utils'
import { InteractionStatus } from '@/enums/interaction-status.enum'
import { MENTOR_WORKING_STATUS } from '@/config/constants'
import { MessageRole } from '@/enums'
import { useInteract } from '@/app/hooks/use-send-message'
import { useInteractionStore } from '@/providers/interaction-store-provider'

const DraggableButton = motion.create(Button)

export function RecorderButton() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { status, updateStatus } = useInteractionStore((store) => store)
  const isCancelled = useRef(false)
  const recordingStartTime = useRef<number>(0)
  const x = useMotionValue(0)
  const { interact, transcribeAudio } = useInteract()

  const { isDisabled } = useMemo(
    () => ({
      isDisabled: MENTOR_WORKING_STATUS.includes(status),
    }),
    [status]
  )

  const bg = useTransform(
    x,
    [0, -256 * 2],
    ['rgba(15,23,42,0.95)', 'rgba(127,29,29,0.95)'] // slate-950 a red-900
  )

  const startRecording = async () => {
    updateStatus(InteractionStatus.RECORDING_AUDIO)
    recordingStartTime.current = Date.now()

    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach((audioElem) => audioElem.pause())

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const recorder = new MediaRecorder(stream)

    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => {
      if (event.data.size) {
        chunks.push(event.data)
      }
    }

    recorder.onstop = async () => {
      try {
        const endTime = Date.now()
        const duration = (endTime - recordingStartTime.current) / 1000 // in seconds

        if (isCancelled.current || duration < 2) {
          updateStatus(InteractionStatus.IDLE)
          return
        }

        const blob = new Blob(chunks, {
          type: 'audio/webm',
        })

        const transcribedText = await transcribeAudio(blob)

        if (!transcribedText) {
          throw new Error('Transcription failed')
        }

        if (transcribedText.text) {
          interact({
            id: uuidv4(),
            role: MessageRole.User,
            content: transcribedText.text,
          })
        } else {
          console.info('Transcription result is empty')

          updateStatus(InteractionStatus.IDLE)
        }
      } catch (err: unknown) {
        console.error(err)

        updateStatus(InteractionStatus.ERROR)
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

  const handlePointerDown = () => {
    if (!isDisabled) {
      isCancelled.current = false
      setIsPointerDown(true)
      startRecording()
    }
  }

  const handlePointerUp = () => {
    setIsPointerDown(false)
    stopRecording()
  }

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const currentWidth = constraintsRef.current?.clientWidth || 0

    isCancelled.current = info.offset.x <= 56 - currentWidth
  }

  const handleDragEnd = () => {
    setIsPointerDown(false)
    stopRecording()
  }

  return (
    <motion.div
      ref={constraintsRef}
      className="relative h-14 w-64 rounded-full bg-slate-950 transition-colors duration-500"
      style={{ background: isPointerDown ? bg : 'transparent' }}
    >
      <span
        className={cn(
          'absolute inset-0 grid size-14 place-items-center text-red-500/75 transition-opacity duration-300',
          !isPointerDown && 'opacity-0'
        )}
      >
        <IconTrash />
      </span>

      <DraggableButton
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onContextMenu={(e) => e.preventDefault()}
        className={cn('absolute', isPointerDown && 'active')}
        isActive={isPointerDown}
        disabled={isDisabled}
        style={{ x, right: '0' }}
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        drag={isDisabled ? false : 'x'}
        dragSnapToOrigin
      >
        <IconMicrophone
          className={cn(
            'size-6 transition-colors duration-300',
            !isDisabled && 'group-hover:text-slate-200'
          )}
        />
      </DraggableButton>
    </motion.div>
  )
}
