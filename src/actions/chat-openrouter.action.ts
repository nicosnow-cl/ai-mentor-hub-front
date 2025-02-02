"use server";

import {
  chatOpenRouterSvc,
  ChatOpenRouterSvcInput,
} from "@/services/chat-openrouter.post";
import { getThinkAndContent } from "@/helpers/get-think-and-content";
import { Message } from "@/stores/chat-store";

export const chatOpenRouterAct = async (
  input: ChatOpenRouterSvcInput
): Promise<Message> => {
  const res = await chatOpenRouterSvc(input);
  const data = await res.json();

  console.log({ data });

  const { think, content } = getThinkAndContent(data.choices[0].message);
  return {
    role: data.choices[0].message.role,
    content,
    think,
  };
};
