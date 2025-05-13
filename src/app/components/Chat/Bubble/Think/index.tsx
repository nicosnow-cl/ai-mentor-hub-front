'use client'

import { useState } from 'react'
import {
  IconBulbFilled,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export type ThinkProps = {
  children?: string | null
}

export function Think({ children }: Readonly<ThinkProps>) {
  const [open, setOpen] = useState(false)

  if (!children) {
    return null
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="glass mt-2 rounded-md bg-blue-300/5 p-2 text-xs text-blue-200"
    >
      <div className="flex justify-between gap-y-2">
        <span className="flex items-center gap-x-1 font-bold">
          <IconBulbFilled className="size-4" /> Cadena de pensamientos
        </span>

        <CollapsibleTrigger>
          {open ? (
            <IconChevronUp className="size-4" />
          ) : (
            <IconChevronDown className="size-4" />
          )}
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent asChild>
        <pre className="mt-2 whitespace-pre-wrap">
          <code>{children}</code>
        </pre>
      </CollapsibleContent>
    </Collapsible>
  )
}
