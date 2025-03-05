"use server";

import { sttElevenLabsSvc } from "@/services/stt-elevenlabs.client";

type SttResponse = {
  language: string;
  text: string;
};

export const sttElevenLabsAct = async (
  audioBlob: Blob
): Promise<SttResponse> => {
  const transcription = await sttElevenLabsSvc(audioBlob);

  return {
    text: transcription.text,
    language: transcription.language_code,
  };
};
