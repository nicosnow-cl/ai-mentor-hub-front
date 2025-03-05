"use server";

import { STTClient } from "@/clients/stt.client";

// import { sttSvc } from "@/services/stt.post";

export const sttAct = async (audio: Blob) => {
  // const formData = new FormData();
  // formData.append("audio", audioBlob, "audio.mp3");

  // const res = await sttSvc(formData);

  // return res.json();

  return STTClient.getInstance().transcribe(audio);
};
