"use server";

import { ttsElevenLabsSvc } from "@/services/tts-elevenlabs.service";

export const ttsElevenLabsAct = async (text: string) => {
  const audioBuffer = await ttsElevenLabsSvc(text);

  const buffer = Buffer.from(audioBuffer);

  return "data:audio/mpeg" + ";base64," + buffer.toString("base64");
};
