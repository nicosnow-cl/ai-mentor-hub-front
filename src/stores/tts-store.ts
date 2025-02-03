import { createStore } from "zustand/vanilla";

import { base64ToAudioUrl } from "@/helpers/base64-to-audio-url";

export type TtsState = {
  audioUrl?: string;
};

export type TtsActions = {
  generateAudioUrl: (base64: string) => void;
};

export type TtsStore = TtsState & TtsActions;

export const defaultInitState: TtsState = {};

export const createTtsStore = (initState: TtsState = defaultInitState) => {
  return createStore<TtsStore>()((set) => ({
    ...initState,
    generateAudioUrl: (base64) =>
      set((state) => {
        const audioUrl = base64ToAudioUrl(base64);

        return { ...state, audioUrl };
      }),
  }));
};
