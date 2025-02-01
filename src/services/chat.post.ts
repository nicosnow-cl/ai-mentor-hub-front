import { Message } from "@/stores/chat-store";

export type ChatSvcInput = string | Message[];

export const chatSvc = (input: ChatSvcInput) => {
  const payload = {
    model: "gemma-2-2b-it",
    messages: [
      {
        role: "system",
        content:
          "I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let’s start practicing, you could ask me a question first. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.",
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
