import { createStore } from "zustand/vanilla";

import { InteractionStatus } from "@/enums/interaction-status.enum";

export type InteractionState = {
  status: InteractionStatus;
  recordingTimeLeft: number;
};

export type InteractionActions = {
  updateStatus: (status: InteractionStatus) => void;
  updateRecordingTimeLeft: (timeMs: number) => void;
};

export type InteractionStore = InteractionState & InteractionActions;

export const defaultInitState: InteractionState = {
  status: InteractionStatus.Idle,
  recordingTimeLeft: 30 * 1000, // 30 Segundos
};

export const createInteractionStore = (
  initState: InteractionState = defaultInitState
) => {
  return createStore<InteractionStore>()((set) => ({
    ...initState,
    updateStatus: (status) => set((state) => ({ ...state, status })),
    updateRecordingTimeLeft: (timeMs) =>
      set((state) => ({ ...state, recordingTimeLeft: Math.max(0, timeMs) })),
  }));
};
