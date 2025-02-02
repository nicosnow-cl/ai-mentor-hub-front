"use server";

import {
  ChatLmStudioSvcInput,
  chatLmStudioSvc,
} from "@/services/chat-lm-studio.post";
import { getThinkAndContent } from "@/helpers/get-think-and-content";
import { Message } from "@/stores/chat-store";

export const chatLmStudioAct = async (
  input: ChatLmStudioSvcInput
): Promise<Message> => {
  const res = await chatLmStudioSvc(input);
  const data = await res.json();

  const { think, content } = getThinkAndContent(data.choices[0].message);

  return {
    role: data.choices[0].message.role,
    content,
    think,
  };
};
