'use client'

import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { InteractionStatus, MessageRole } from '@/enums'
import { useChatStore } from '@/providers/chat-store-provider'
import { useTtsStore } from '@/providers/tts-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { llmAct } from '@/actions/llm.action'
import { ttsAct } from '@/actions/tts.action'

const MENTOR_WORKING_STATUS = [
  InteractionStatus.STT,
  InteractionStatus.Thinking,
  InteractionStatus.TTS,
]

export function Accelerators() {
  const { messages, appendMessage } = useChatStore((state) => state)
  const { status, updateStatus } = useInteractionStore((store) => store)
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  )
  const accelerators = useMemo(() => {
    const assistantMessages = messages.filter(
      (message) => message.role === MessageRole.Assistant
    )

    if (!assistantMessages.length) {
      return null
    }

    const { accelerators } = assistantMessages.slice(-1)[0]

    return accelerators
  }, [messages])

  const handleSubmitMessage = async (message: string) => {
    try {
      const newUserMessage = {
        id: uuidv4(),
        role: MessageRole.User,
        content: message,
      }

      appendMessage(newUserMessage)
      updateStatus(InteractionStatus.Thinking)

      const assistantMessage = await llmAct([...messages, newUserMessage])

      appendMessage(assistantMessage)
      updateStatus(InteractionStatus.TTS)

      const audioGenerated = await ttsAct(assistantMessage.content)

      if (audioGenerated.error) {
        throw new Error(audioGenerated.error)
      }

      generateAudioUrl(assistantMessage.id, audioGenerated.base64 as string)
      setCurrentMessageId(assistantMessage.id)

      updateStatus(InteractionStatus.Idle)
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error generating response. Please try again.')
    }
  }

  if (!accelerators?.length) {
    return null
  }

  return (
    <div className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2 transform">
      <div className="mx-auto flex gap-x-2">
        {accelerators.map((accelerator, idx) => (
          <Button
            key={`${accelerator}-${idx}`}
            className="glass border border-slate-500/10"
            size="sm"
            variant="ghost"
            onClick={() => handleSubmitMessage(accelerator)}
            disabled={MENTOR_WORKING_STATUS.includes(status)}
          >
            {accelerator}
          </Button>
        ))}
      </div>
    </div>
  )
}
