'use client'

import { Button } from '@/components/ui/button'
import { useChatStore } from '@/providers/chat-store-provider'
import { IconRefresh } from '@tabler/icons-react'

export function ResetButton() {
  const { reset } = useChatStore((state) => state)

  return (
    <Button className="ml-auto" variant="ghost" size="icon" onClick={reset}>
      <IconRefresh />
    </Button>
  )
}
