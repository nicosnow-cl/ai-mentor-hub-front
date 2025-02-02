"use server";

import { sttSvc } from "@/services/stt.post";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6a8167f (feat: :sparkles: Implemented chat history)
type SttResponse = {
  language: string;
  text: string;
};

export const sttAct = async (audioBlob: Blob): Promise<SttResponse> => {
<<<<<<< HEAD
=======
export const sttAct = async (audioBlob: Blob) => {
>>>>>>> 29417e0 (feat: :sparkles: Initial commit)
=======
>>>>>>> 6a8167f (feat: :sparkles: Implemented chat history)
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.mp3");

  const res = await sttSvc(formData);

  return res.json();
};
