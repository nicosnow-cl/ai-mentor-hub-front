import { createStore } from "zustand/vanilla";

export type MenuDrawerState = {
  open: boolean;
};

export type MenuDrawerActions = {
  toogleDrawer: (open?: boolean) => void;
};

export type MenuDrawerStore = MenuDrawerState & MenuDrawerActions;

export const defaultInitState: MenuDrawerState = {
  open: false,
};

export const createMenuDrawerStore = (
  initState: MenuDrawerState = defaultInitState
) => {
  return createStore<MenuDrawerStore>()((set) => ({
    ...initState,
    toogleDrawer: (open) =>
      set((state) => ({
        ...state,
        open: typeof open !== undefined ? open : !state.open,
      })),
  }));
};
