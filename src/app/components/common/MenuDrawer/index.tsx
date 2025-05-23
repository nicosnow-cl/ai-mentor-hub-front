'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Menu } from './Menu'
import { useMenuDrawer } from '@/providers/menu-drawer.provider'

export function MenuDrawer() {
  const { open, toogleDrawer } = useMenuDrawer((state) => state)

  return (
    <Drawer open={open} onOpenChange={toogleDrawer} direction="right">
      <DrawerContent
        className="right-0 top-0 mt-0 h-[100dvh] w-full rounded-none sm:max-w-[32rem] md:max-w-[40rem] lg:max-w-[48rem]"
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

        <div className="h-full px-2">
          <Menu />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
