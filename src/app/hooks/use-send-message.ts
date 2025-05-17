'use client'

import { toast } from 'sonner'
import { useMediaQuery } from '@uidotdev/usehooks'

import { InteractionStatus } from '@/enums'
import { llmAct } from '@/actions/llm.action'
import { Message } from '@/types/chats'
import { MESSAGE_TEXTFIELD_ID } from '@/app/components/InteractionInput/MessageTextfield'
import { sttAct } from '@/actions/stt.action'
import { ttsAct } from '@/actions/tts.action'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { useTtsStore } from '@/providers/tts-store-provider'

export const useInteract = () => {
  const { messages, appendMessage } = useChatStore((state) => state)
  const { updateStatus } = useInteractionStore((store) => store)
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  )
  const isMobile = useMediaQuery('(max-width: 768px)')

  const sendMessage = async (message: Message) => {
    try {
      updateStatus(InteractionStatus.Thinking)
      appendMessage(message)

      const firstMessage = messages[0]
      const lastTwoMessages = messages.slice(-2)

      const assistantMessage = await llmAct([
        firstMessage,
        ...lastTwoMessages,
        message,
      ])

      appendMessage(assistantMessage)

      updateStatus(InteractionStatus.Idle)

      return assistantMessage
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error generating response. Please try again.')
    }
  }

  const generateAudio = async (message: Message) => {
    try {
      updateStatus(InteractionStatus.TTS)

      const audioGenerated = await ttsAct(message.content)

      generateAudioUrl(message.id, audioGenerated.base64 as string)

      updateStatus(InteractionStatus.Idle)
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error generating audio. Please try again.')
    }
  }

  const transcribeAudio = async (audio: Blob) => {
    try {
      updateStatus(InteractionStatus.STT)

      const recognizedText = await sttAct(audio)

      updateStatus(InteractionStatus.Idle)

      return recognizedText
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error transcribing audio. Please try again.')
    }
  }

  const interact = async (message: Message) => {
    try {
      const assistantMessage = await sendMessage(message)

      if (!assistantMessage) {
        throw new Error('Assistant message is undefined')
      }

      await generateAudio(assistantMessage)

      setCurrentMessageId(assistantMessage.id)

      if (!isMobile) {
        document.getElementById(MESSAGE_TEXTFIELD_ID)?.focus()
      }
    } catch (err: unknown) {
      console.error(err)
    }
  }

  return { interact, sendMessage, generateAudio, transcribeAudio }
}
