"use server";

import { TTSClient } from "@/clients/tts.client";

export const ttsAct = async (text: string, language?: string) => {
  const { buffer, blobType } = await TTSClient.getInstance().speech(
    text,
    language
  );

  return "data:" + blobType + ";base64," + buffer.toString("base64");
};
