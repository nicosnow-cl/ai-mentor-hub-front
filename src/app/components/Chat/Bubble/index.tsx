import { AudioControls } from './AudioControls'
import { cn } from '@/lib/utils'
import { Content } from './Content'
import { EmitterBadge } from './EmitterBadge'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums/message-role.enum'
import { Think } from './Think'

export type BubbleProps = {
  message: Message
  className?: string
}

export function Bubble({ message, className = '' }: Readonly<BubbleProps>) {
  const { role } = message

  return (
    <div
      className={cn(
        'flex flex-col gap-y-2 text-slate-50',
        role === MessageRole.Assistant ? 'text-left' : 'text-right',
        className
      )}
    >
      <div className="flex items-center gap-x-4">
        <EmitterBadge role={role} />

        {role === MessageRole.Assistant && (
          <AudioControls messageId={message.id} />
        )}
      </div>

      <Think>{message.think}</Think>

      <Content>{message.content}</Content>
    </div>
  )
}
