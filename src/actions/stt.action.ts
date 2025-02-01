"use server";

import { sttSvc } from "@/services/stt.post";

<<<<<<< HEAD
type SttResponse = {
  language: string;
  text: string;
};

export const sttAct = async (audioBlob: Blob): Promise<SttResponse> => {
=======
export const sttAct = async (audioBlob: Blob) => {
>>>>>>> 29417e0 (feat: :sparkles: Initial commit)
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.mp3");

  const res = await sttSvc(formData);

  return res.json();
};
