'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  createMenuDrawerStore,
  MenuDrawerStore,
} from '@/stores/menu-drawer.store'

export type MenuDrawerApi = ReturnType<typeof createMenuDrawerStore>

export const MenuDrawerContext = createContext<MenuDrawerApi | undefined>(
  undefined
)

export interface MenuDrawerProviderProps {
  children: ReactNode
}

export const MenuDrawerProvider = ({ children }: MenuDrawerProviderProps) => {
  const storeRef = useRef<MenuDrawerApi>(null)

  if (!storeRef.current) {
    storeRef.current = createMenuDrawerStore()
  }

  return (
    <MenuDrawerContext.Provider value={storeRef.current}>
      {children}
    </MenuDrawerContext.Provider>
  )
}

export const useMenuDrawer = <T,>(
  selector: (store: MenuDrawerStore) => T
): T => {
  const menuDrawerContext = useContext(MenuDrawerContext)

  if (!menuDrawerContext) {
    throw new Error(
      `${useMenuDrawer.name} must be used within ${MenuDrawerContext.name}`
    )
  }

  return useStore(menuDrawerContext, selector)
}
