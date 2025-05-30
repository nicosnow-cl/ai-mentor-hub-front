'use client'

import { toast } from 'sonner'
import { useMediaQuery } from '@uidotdev/usehooks'

import { InteractionStatus } from '@/enums'
import { llmAct } from '@/actions/llm.action'
import { MAX_MEMORY_LENGTH } from '@/config/constants'
import { Message } from '@/types/chats'
import { MESSAGE_TEXTFIELD_ID } from '@/app/components/InteractionInput/MessageTextfield'
import { sttAct } from '@/actions/stt.action'
import { ttsAct } from '@/actions/tts.action'
import { useChatStore } from '@/providers/chat-store-provider'
import { useInteractionStore } from '@/providers/interaction-store-provider'
import { useTtsStore } from '@/providers/tts-store-provider'
import { useUserSettingsStore } from '@/stores/user-settings.store'
import { getLastMessagePairs } from '@/helpers/get-last-messages-pair'
import { useFollowUpsStore } from '@/stores/follow-ups.store'

export const useInteract = () => {
  const { messages, summary, appendMessage } = useChatStore((state) => state)
  const settingsStore = useUserSettingsStore((state) => state)
  const { updateStatus } = useInteractionStore((store) => store)
  const { setCurrentMessageId, generateAudioUrl } = useTtsStore(
    (store) => store
  )
  const generateFollowUps = useFollowUpsStore(
    (store) => store.generateFollowUps
  )
  const isMobile = useMediaQuery('(max-width: 768px)')

  const sendMessage = async (message: Message) => {
    try {
      updateStatus(InteractionStatus.THINKING)
      appendMessage(message)

      const chatHistory = getLastMessagePairs(
        messages.filter((message) => !message.error),
        MAX_MEMORY_LENGTH
      )

      const settings = {
        mentorName: settingsStore.mentorName,
        instructions: settingsStore.instructions,
        topic: settingsStore.topic,
        subTopic: settingsStore.subTopic,
        language: settingsStore.language,
        userName: settingsStore.userName,
      }

      const assistantMessage = await llmAct({
        input: [...chatHistory, message],
        settings,
        summary,
      })

      appendMessage(assistantMessage)
      generateFollowUps(assistantMessage.id, [...chatHistory, assistantMessage])

      updateStatus(InteractionStatus.IDLE)

      return assistantMessage
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.ERROR)
      toast.error('Error generating response. Please try again.')
    }
  }

  const generateAudio = async (message: Message) => {
    try {
      updateStatus(InteractionStatus.TTS)

      const audioGenerated = await ttsAct(message.content)

      generateAudioUrl(message.id, audioGenerated.base64 as string)

      updateStatus(InteractionStatus.IDLE)
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.ERROR)
      toast.error('Error generating audio. Please try again.')
    }
  }

  const transcribeAudio = async (audio: Blob) => {
    try {
      updateStatus(InteractionStatus.STT)

      const recognizedText = await sttAct(audio)

      updateStatus(InteractionStatus.IDLE)

      return recognizedText
    } catch (err: unknown) {
      console.error(err)

      updateStatus(InteractionStatus.ERROR)
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
