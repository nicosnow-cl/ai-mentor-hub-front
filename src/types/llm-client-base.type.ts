import { Message } from "@/stores/chat-store";

export type LLMInput = string | Message[];

export type LLMClientBase = {
  chat(input: LLMInput): Promise<Message>;
};
