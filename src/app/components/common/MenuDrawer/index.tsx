'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMenuDrawer } from '@/providers/menu-drawer.provider'
import { Menu } from './Menu'

export function MenuDrawer() {
  const { open, toogleDrawer } = useMenuDrawer((state) => state)

  return (
    <Drawer open={open} onOpenChange={toogleDrawer} direction="right">
      <DrawerContent
        className="right-0 top-0 mt-0 h-screen w-[18rem] rounded-bl-3xl rounded-tl-3xl lg:w-[24rem]"
        style={
          {
            '--initial-transform': 'calc(100% + 8px)',
          } as React.CSSProperties
        }
      >
        <div className="hidden">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>App Menu</DrawerDescription>
          </DrawerHeader>
        </div>

        <Menu />
      </DrawerContent>
    </Drawer>
  )
}
