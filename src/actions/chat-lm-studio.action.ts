"use server";

import {
  ChatLmStudioSvcInput,
  chatLmStudioSvc,
} from "@/services/chat-lm-studio.post";
<<<<<<< HEAD
import { getThinkAndContent } from "@/helpers/get-think-and-content";
=======
>>>>>>> 6a8167f (feat: :sparkles: Implemented chat history)
import { Message } from "@/stores/chat-store";

export const chatLmStudioAct = async (
  input: ChatLmStudioSvcInput
): Promise<Message> => {
  const res = await chatLmStudioSvc(input);
  const data = await res.json();

<<<<<<< HEAD
  const { think, content } = getThinkAndContent(data.choices[0].message);

  return {
    role: data.choices[0].message.role,
    content,
    think,
  };
=======
  return data.choices[0].message;
>>>>>>> 6a8167f (feat: :sparkles: Implemented chat history)
};
