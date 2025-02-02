"use server";

import { ttsSvc } from "@/services/tts.post";

export const ttsAct = async (text: string, language?: string) => {
  const res = await ttsSvc(text, language);
  const blob = await res.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  return "data:" + blob.type + ";base64," + buffer.toString("base64");
};
