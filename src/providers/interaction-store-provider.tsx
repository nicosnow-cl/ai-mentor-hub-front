"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  createInteractionStore,
  InteractionStore,
} from "@/stores/interaction-store";

export type InteractionStoreApi = ReturnType<typeof createInteractionStore>;

export const InteractionStoreContext = createContext<
  InteractionStoreApi | undefined
>(undefined);

export interface InteractionStoreProviderProps {
  children: ReactNode;
}

export const InteractionStoreProvider = ({
  children,
}: InteractionStoreProviderProps) => {
  const storeRef = useRef<InteractionStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createInteractionStore();
  }

  return (
    <InteractionStoreContext.Provider value={storeRef.current}>
      {children}
    </InteractionStoreContext.Provider>
  );
};

export const useInteractionStore = <T,>(
  selector: (store: InteractionStore) => T
): T => {
  const interactionStoreContext = useContext(InteractionStoreContext);

  if (!interactionStoreContext) {
    throw new Error(
      `${useInteractionStore.name} must be used within ${InteractionStoreContext.name}`
    );
  }

  return useStore(interactionStoreContext, selector);
};
