"use server";

import { ChatSvcInput, chatSvc } from "@/services/chat.post";

export const chatAct = async (input: ChatSvcInput) => {
  const res = await chatSvc(input);

  return res.json();
};
