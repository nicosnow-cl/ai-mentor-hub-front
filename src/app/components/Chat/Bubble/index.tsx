import ReactMarkdown from 'react-markdown'

import { AudioControls } from './AudioControls'
import { ChatRole } from '@/enums/chat-role.enum'
import { EmitterBadge } from './EmitterBadge'
import { Message } from '@/stores/chat-store'

export type BubbleProps = {
  message: Message
  className?: string
}

export function Bubble({ message, className = '' }: Readonly<BubbleProps>) {
  const { role, content, think } = message

  return (
    <div
      className={`flex flex-col gap-y-2 text-slate-50 ${
        role === ChatRole.Assistant ? 'text-left' : 'text-right'
      } ${className}`}
    >
      <div className="flex items-center gap-x-4">
        <EmitterBadge role={role} />

        {role === ChatRole.Assistant && (
          <AudioControls messageId={message.id} />
        )}
      </div>

      {think && (
        <pre className="flex flex-col whitespace-pre-wrap text-xs">
          <span className="font-bold">Think</span>
          {think}
        </pre>
      )}

      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
