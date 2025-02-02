"use server";

import { sttSvc } from "@/services/stt.post";

type SttResponse = {
  language: string;
  text: string;
};

export const sttAct = async (audioBlob: Blob): Promise<SttResponse> => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.mp3");

  const res = await sttSvc(formData);

  return res.json();
};
