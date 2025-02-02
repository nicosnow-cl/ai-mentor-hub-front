import { ChatRole } from "@/enums/chat-role.enum";
import { Message } from "@/stores/chat-store";

export const getThinkAndContent = (
  message: Message
): { think: string; content: string } => {
  let think = "";
  let content = "";

  if (
    message.role === ChatRole.Assistant &&
    message.content.includes("</think>")
  ) {
    think = message.content
      .split("</think>")[0]
      .replace("<think>", "")
      .replace("</think>", "");

    content = message.content.split("</think>")[1];
  } else {
    content = message.content;
  }

  return {
    think,
    content,
  };
};
