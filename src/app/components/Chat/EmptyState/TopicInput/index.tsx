'use client'

import { IconHelpOctagonFilled } from '@tabler/icons-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useChatStore } from '@/providers/chat-store-provider'

export function TopicInput() {
  const { topic, updateTopic } = useChatStore((state) => state)

  return (
    <div className="grid w-full max-w-sm place-items-start gap-1.5">
      <Label className="flex items-center gap-x-2 pl-2" htmlFor="topic">
        Tema
        <TooltipProvider>
          <Tooltip delayDuration={250}>
            <TooltipTrigger asChild>
              <IconHelpOctagonFilled className="size-4" />
            </TooltipTrigger>

            <TooltipContent>
              <p className="text-sm">
                Este tema se usará para personalizar la conversación con tu
                mentor.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>

      <Input
        id="topic"
        type="text"
        minLength={3}
        maxLength={100}
        placeholder="Escribe un tema del que quieras aprender"
        value={topic}
        onChange={(evt) => updateTopic(evt.target.value)}
      />
    </div>
  )
}
