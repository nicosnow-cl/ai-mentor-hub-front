'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { cn } from '@/lib/utils'
import { MENTOR_WORKING_STATUS } from '@/config/constants'
import { MessageRole } from '@/enums'
import { useInteract } from '@/app/hooks/use-send-message'
import { useInteractionStore } from '@/providers/interaction-store-provider'

export const MESSAGE_TEXTFIELD_ID = 'message-textfield'

export function MessageTextfield() {
  const [text, setText] = useState('')
  const { status } = useInteractionStore((store) => store)
  const { interact } = useInteract()

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setText(evt.target.value)
  }

  const handleSubmitText = async () => {
    await interact({
      id: uuidv4(),
      role: MessageRole.User,
      content: text,
      createdAt: new Date().toISOString(),
    })

    setText('')
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
      id={MESSAGE_TEXTFIELD_ID}
      className={cn(
        'block w-full rounded-lg bg-transparent p-2.5 outline-0',
        MENTOR_WORKING_STATUS.includes(status) && 'opacity-50'
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
