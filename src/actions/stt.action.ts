"use server";

import { sttSvc } from "@/services/stt.post";

export const sttAct = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.mp3");

  const res = await sttSvc(formData);

  return res.json();
};
