import { IconBulbFilled } from '@tabler/icons-react'

import { AudioControls } from './AudioControls'
import { cn } from '@/lib/utils'
import { Content } from './Content'
import { EmitterBadge } from './EmitterBadge'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums/message-role.enum'

export type BubbleProps = {
  message: Message
  className?: string
}

export function Bubble({ message, className = '' }: Readonly<BubbleProps>) {
  const { role, content, think } = message

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

      {think && (
        <pre className="glass mt-2 flex flex-col whitespace-pre-wrap rounded-md bg-blue-300/5 p-2 text-xs text-blue-200">
          <span className="flex font-bold">
            <IconBulbFilled className="size-4" /> Cadena de pensamientos
          </span>
          <code>{think}</code>
        </pre>
      )}

      <Content>{content}</Content>
    </div>
  )
}
