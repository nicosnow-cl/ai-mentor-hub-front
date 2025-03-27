"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMenuDrawer } from "@/providers/menu-drawer.provider";
import { Menu } from "./Menu";

export function MenuDrawer() {
  const { open, toogleDrawer } = useMenuDrawer((state) => state);

  return (
    <Drawer open={open} onOpenChange={toogleDrawer} direction="right">
      <DrawerContent
        className="w-[18rem] lg:w-[24rem] right-0 top-0 mt-0 rounded-tl-3xl rounded-bl-3xl h-screen"
        style={
          { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
        }
      >
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>

        <Menu />
      </DrawerContent>
    </Drawer>
  );
}
