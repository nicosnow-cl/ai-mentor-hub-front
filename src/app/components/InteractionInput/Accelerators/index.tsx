'use client'

import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { MENTOR_WORKING_STATUS } from '@/config/constants'
import { MessageRole } from '@/enums'
import { useFollowUpsStore } from '@/stores/follow-ups.store'
import { useInteract } from '@/app/hooks/use-interact'
import { useInteractionStore } from '@/providers/interaction-store-provider'

export function Accelerators() {
  const { messageId, followUps, isLoading } = useFollowUpsStore(
    (store) => store
  )
  const { status } = useInteractionStore((store) => store)
  const { interact } = useInteract()

  const handleSubmitMessage = (message: string) =>
    interact({
      id: uuidv4(),
      role: MessageRole.User,
      content: message,
      createdAt: new Date().toISOString(),
    })

  return (
    <div
      key={`follow-ups-${messageId}`}
      className="mx-auto flex flex-wrap justify-center gap-1"
    >
      {isLoading ? (
        <div className="dot-loader" />
      ) : (
        followUps.map((accelerator, idx) => (
          <Button
            key={`${accelerator}-${idx}`}
            type="button"
            className="glass overflow-ellipsis border border-slate-400/10 hover:bg-slate-400/10 focus:bg-slate-400/10"
            size="sm"
            variant="ghost"
            onClick={() => handleSubmitMessage(accelerator)}
            disabled={MENTOR_WORKING_STATUS.includes(status)}
          >
            {accelerator}
          </Button>
        ))
      )}
    </div>
  )
}
