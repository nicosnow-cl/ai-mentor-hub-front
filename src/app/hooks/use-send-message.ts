'use client'
import { toast } from 'sonner'

import { llmAct } from '@/actions/llm.action'
import { ttsAct } from '@/actions/tts.action'
import { InteractionStatus } from '@/enums'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { Message } from '@/types/chats'
import { useTtsStore } from '@/providers/tts-store-provider'

export const useSendMessage = () => {
  const { messages, appendMessage } = useChatStore((state) => state)
  const { updateStatus } = useInteractionStore((store) => store)
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  )

  const sendMessage = async (newMessage: Message) => {
    try {
      appendMessage(newMessage)
      updateStatus(InteractionStatus.Thinking)

      const firstMessage = messages[0]
      const lastTwoMessages = messages.slice(-2)

      const assistantMessage = await llmAct([
        firstMessage,
        ...lastTwoMessages,
        newMessage,
      ])

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

  return sendMessage
}
