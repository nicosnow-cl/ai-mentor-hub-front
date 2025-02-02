import { createStore } from "zustand/vanilla";

import { InteractionStatus } from "@/enums/interaction-status.enum";

export type InteractionState = {
  status: InteractionStatus;
};

export type InteractionActions = {
  updateStatus: (status: InteractionStatus) => void;
};

export type InteractionStore = InteractionState & InteractionActions;

export const defaultInitState: InteractionState = {
  status: InteractionStatus.Idle,
};

export const createInteractionStore = (
  initState: InteractionState = defaultInitState
) => {
  return createStore<InteractionStore>()((set) => ({
    ...initState,
    updateStatus: (status: InteractionStatus) =>
      set((state) => ({ ...state, status })),
  }));
};
