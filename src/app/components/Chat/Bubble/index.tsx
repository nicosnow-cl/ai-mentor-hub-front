import { AudioControls } from './AudioControls'
import { cn } from '@/lib/utils'
import { Content } from './Content'
import { EmitterBadge } from './EmitterBadge'
import { getDate, getTime } from '@/helpers/intl-helpers'
import { Message } from '@/types/chats'
import { MessageRole } from '@/enums/message-role.enum'
import { Think } from './Think'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type BubbleProps = {
  message: Message
  className?: string
}

export function Bubble({ message, className = '' }: Readonly<BubbleProps>) {
  const { role, createdAt } = message

  return (
    <div
      className={cn(
        'relative flex flex-col gap-y-2 text-slate-50',
        role === MessageRole.Assistant ? 'mr-12 text-left' : 'ml-12 text-right',
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

      {createdAt && (
        <TooltipProvider>
          <Tooltip delayDuration={250}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'absolute -bottom-2 text-xs opacity-50',
                  role === MessageRole.Assistant ? 'left-0' : 'right-0'
                )}
              >
                {getTime(createdAt)}
              </span>
            </TooltipTrigger>

            <TooltipContent className="opacity-75" side="bottom">
              {getDate(createdAt)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
