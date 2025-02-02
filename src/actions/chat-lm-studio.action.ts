"use server";

import {
  ChatLmStudioSvcInput,
  chatLmStudioSvc,
} from "@/services/chat-lm-studio.post";
import { Message } from "@/stores/chat-store";

export const chatLmStudioAct = async (
  input: ChatLmStudioSvcInput
): Promise<Message> => {
  const res = await chatLmStudioSvc(input);
  const data = await res.json();

  return data.choices[0].message;
};
