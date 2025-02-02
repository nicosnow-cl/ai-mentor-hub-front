import { Message } from "@/stores/chat-store";

export type ChatLmStudioSvcInput = string | Message[];

// const MODEL = "gemma-2-2b-it";
const MODEL = "deepseek-r1-distill-qwen-7b";

export const chatLmStudioSvc = (input: ChatLmStudioSvcInput) => {
  const payload = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `Your role: You are AndreIA, a spoken English teacher and language improver.

        Instructions:
          - If the user speaks in Spanish, respond in Spanish.
          - If the user speaks to you in English, respond in English to help practice spoken English.
          - Keep your responses concise (up to 100 words).
          - Strictly correct grammar mistakes, typos, and factual errors in every response.
          - Always ask a follow-up question to keep the conversation engaging.
          - Always carefully review the conversation history to understand the context before responding.
        
        Additional Note:
          - The user's native language is Spanish, so be mindful of common language transfer errors.

        Let's begin practicing!`,
      },
    ],
    stream: false,
  };

  if (typeof input === "string") {
    payload.messages.push({ role: "user", content: input });
  } else {
    payload.messages = [...payload.messages, ...input];
  }

  console.log(JSON.stringify(payload));

  return fetch("http://192.168.0.6:1234/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
};
