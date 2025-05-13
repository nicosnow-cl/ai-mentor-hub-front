'use client'
import { toast } from 'sonner'

import { InteractionStatus } from '@/enums'
import { llmAct } from '@/actions/llm.action'
import { Message } from '@/types/chats'
import { ttsAct } from '@/actions/tts.action'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { useTtsStore } from '@/providers/tts-store-provider'
import { sttAct } from '@/actions/stt.action'

export const useInteract = () => {
  const { messages, appendMessage } = useChatStore((state) => state)
  const { updateStatus } = useInteractionStore((store) => store)
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  )

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

      return assistantMessage
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error generating response. Please try again.')
    } finally {
      updateStatus(InteractionStatus.Idle)
    }
  }

  const generateAudio = async (message: Message) => {
    try {
      updateStatus(InteractionStatus.TTS)

      const audioGenerated = await ttsAct(message.content)

      if (audioGenerated.error) {
        throw new Error(audioGenerated.error)
      }

      generateAudioUrl(message.id, audioGenerated.base64 as string)

      updateStatus(InteractionStatus.Idle)
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error generating audio. Please try again.')
    } finally {
      updateStatus(InteractionStatus.Idle)
    }
  }

  const transcribeAudio = async (audio: Blob) => {
    try {
      updateStatus(InteractionStatus.STT)

      const recognizedText = await sttAct(audio)

      if (recognizedText.error) {
        throw new Error(recognizedText.error)
      }

      return recognizedText
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.Error)
      toast.error('Error transcribing audio. Please try again.')
    } finally {
      updateStatus(InteractionStatus.Idle)
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
    } catch (err: unknown) {
      console.error(err)
    }
  }

  return { interact, sendMessage, generateAudio, transcribeAudio }
}
