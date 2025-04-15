'use client'

import { Button } from '@/components/ui/button'
import { IconMenu2 } from '@tabler/icons-react'

import { useMenuDrawer } from '@/providers/menu-drawer.provider'

export function MenuButton() {
  const { toogleDrawer } = useMenuDrawer((state) => state)

  return (
    <Button onClick={() => toogleDrawer(true)} variant="ghost" size="icon">
      <IconMenu2 />
    </Button>
  )
}
