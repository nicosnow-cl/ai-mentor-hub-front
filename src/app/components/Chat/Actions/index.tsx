'use client'

import { Button } from '@/components/ui/button'

import { useMenuDrawer } from '@/providers/menu-drawer.provider'

export function Actions() {
  const { toogleDrawer } = useMenuDrawer((state) => state)

  return (
    <Button
      className="mx-auto w-fit"
      variant="ghost"
      onClick={() => toogleDrawer(true)}
    >
      Ver más
    </Button>
  )
}
