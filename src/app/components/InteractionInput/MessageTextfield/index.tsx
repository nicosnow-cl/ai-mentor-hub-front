'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { cn } from '@/lib/utils'
import { InteractionStatus } from '@/enums/interaction-status.enum'
import { llmAct } from '@/actions/llm.action'
import { MessageRole } from '@/enums'
import { ttsAct } from '@/actions/tts.action'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { useTtsStore } from '@/providers/tts-store-provider'

const MENTOR_WORKING_STATUS = [
  InteractionStatus.STT,
  InteractionStatus.Thinking,
  InteractionStatus.TTS,
]

export function MessageTextfield() {
  const [text, setText] = useState('')
  const { messages, appendMessage } = useChatStore((state) => state)
  const { status, updateStatus } = useInteractionStore((store) => store)
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  )

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setText(evt.target.value)
  }

  const handleSubmitText = async () => {
    try {
      const newUserMessage = {
        id: uuidv4(),
        role: MessageRole.User,
        content: text,
      }

      appendMessage(newUserMessage)
      updateStatus(InteractionStatus.Thinking)

      const assistantMessage = await llmAct([...messages, newUserMessage])

      appendMessage(assistantMessage)
      updateStatus(InteractionStatus.TTS)
      setText('')

      const audioBase64 = await ttsAct(assistantMessage.content)

      generateAudioUrl(assistantMessage.id, audioBase64)
      setCurrentMessageId(assistantMessage.id)

      updateStatus(InteractionStatus.Idle)
    } catch (err: unknown) {
      console.error({
        err,
      })

      updateStatus(InteractionStatus.Error)
    }
  }

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (MENTOR_WORKING_STATUS.includes(status)) {
      return
    }

    const key = evt.key

    if (key === 'Enter') {
      handleSubmitText()
    }
  }

  return (
    <input
      ref={(input) => input?.focus()}
      className={cn(
        'block w-full rounded-lg !bg-transparent p-2.5 outline-0',
        MENTOR_WORKING_STATUS.includes(status) ? 'opacity-50' : 'opacity-100'
      )}
      type="text"
      placeholder="Preguntame cualquier cosa..."
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      value={text}
      disabled={MENTOR_WORKING_STATUS.includes(status)}
    />
  )
}
