"use server";

import { ttsSvc } from "@/services/tts.post";

<<<<<<< HEAD
export const ttsAct = async (text: string, language?: string) => {
  const res = await ttsSvc(text, language);
  const blob = await res.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

=======
export const ttsAct = async (text: string) => {
  const res = await ttsSvc(text);
  const blob = await res.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  // // Convert stream to a Buffer
  // const chunks: any[] = [];
  // for await (const chunk of buffer) {
  //   chunks.push(chunk);
  // }
  // const buffer = Buffer.concat(chunks);

  // Convert to base64 to be serializable
>>>>>>> 29417e0 (feat: :sparkles: Initial commit)
  return "data:" + blob.type + ";base64," + buffer.toString("base64");
};
