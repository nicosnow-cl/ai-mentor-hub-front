"use client";

import { useTtsStore } from "@/providers/tts-store-provider";

export function VoiceSpeech() {
  const { audioUrl } = useTtsStore((store) => store);

  if (!audioUrl) {
    return null;
  }

  return (
    <audio key={Math.random()} autoPlay>
      <source src={audioUrl} type="audio/wav" />
      Tu navegador no soporta reproducción de audio.
    </audio>
  );
}
