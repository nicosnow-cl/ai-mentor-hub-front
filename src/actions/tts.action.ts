"use server";

import { TTSClient } from "@/clients/tts.client";

// import { ttsSvc } from "@/services/tts.post";

export const ttsAct = async (text: string, language?: string) => {
  // const res = await ttsSvc(text, language);
  // const blob = await res.blob();
  // const buffer = Buffer.from(await blob.arrayBuffer());

  const { buffer, blobType } = await TTSClient.getInstance().speech(
    text,
    language
  );

  return "data:" + blobType + ";base64," + buffer.toString("base64");
};
