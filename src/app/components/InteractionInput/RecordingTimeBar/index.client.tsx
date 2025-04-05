'use client'

import { startTransition, useEffect, useMemo, useState } from 'react'

import { InteractionStatus } from '@/enums/interaction-status.enum'
import { useInteractionStore } from '@/providers/interaction-store-provider'

const initialTime = 20 * 1000 // 20 Segundos

export function RecordingTimeBar() {
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(initialTime)
  const { status } = useInteractionStore((store) => store)

  const percentageLeft = useMemo(
    () => (recordingTimeLeft / initialTime) * 100,
    [recordingTimeLeft]
  )

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    setRecordingTimeLeft(initialTime)

    if (status === InteractionStatus.Recording) {
      intervalId = setInterval(() => {
        startTransition(() => {
          setRecordingTimeLeft((prev) => {
            const timeLeft = Math.max(0, prev - 50)

            if (timeLeft <= 0) {
              clearInterval(intervalId)
            }

            return timeLeft
          })
        })
      }, 50)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [status])

  if (status !== InteractionStatus.Recording) {
    return null
  }

  return (
    <div className="absolute bottom-0 h-fit w-full animate-fade-in">
      <span
        className="fade-x-small mx-auto block h-0.5 rounded-full bg-slate-300"
        style={{
          width: `${percentageLeft}%`,
        }}
      />
    </div>
  )
}
