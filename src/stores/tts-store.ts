import { createStore } from "zustand/vanilla";

import { base64ToAudioUrl } from "@/helpers/base64-to-audio-url";

export type TtsState = {
  audios: Record<string, string>;
  playerStatus: "idle" | "paused" | "playing";
  currentMessageId?: string;
  audioUrl?: string;
  audioRef?: HTMLAudioElement;
};

export type TtsActions = {
  setCurrentMessageId: (messageId: string) => void;
  generateAudioUrl: (messageId: string, base64: string) => void;
  setAudioRef: (audioRef: HTMLAudioElement) => void;
  setPlayerStatus: (playerStatus: "idle" | "paused" | "playing") => void;
};

export type TtsStore = TtsState & TtsActions;

export const defaultInitState: TtsState = { audios: {}, playerStatus: "idle" };

export const createTtsStore = (initState: TtsState = defaultInitState) => {
  return createStore<TtsStore>()((set) => ({
    ...initState,
    setCurrentMessageId: (messageId) =>
      set((state) => ({ ...state, currentMessageId: messageId })),
    generateAudioUrl: (messageId, base64) =>
      set((state) => {
        const audioUrl = base64ToAudioUrl(base64);

        return { ...state, audios: { ...state.audios, [messageId]: audioUrl } };
      }),
    setAudioRef: (audioRef) => set((state) => ({ ...state, audioRef })),
    setPlayerStatus: (playerStatus) =>
      set((state) => ({ ...state, playerStatus })),
  }));
};
