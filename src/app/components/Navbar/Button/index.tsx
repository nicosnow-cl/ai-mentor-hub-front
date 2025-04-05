'use client'

import { IconMenu2 } from '@tabler/icons-react'

import { useMenuDrawer } from '@/providers/menu-drawer.provider'

export function Button() {
  const { toogleDrawer } = useMenuDrawer((state) => state)

  return (
    <button className="absolute right-4" onClick={() => toogleDrawer(true)}>
      <IconMenu2 />
    </button>
  )
}
