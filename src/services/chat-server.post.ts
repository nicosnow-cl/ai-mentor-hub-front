import { Message } from "@/stores/chat-store";

export type ChatServerSvcInput = string | Message[];

// const MODEL = "gemma-2-2b-it";
// const URL = "http://192.168.0.6:1234/v1/chat/completions";
const MODEL = "gemma2:2b";
const URL = "http://127.0.0.1:8000/chat/ollama";

export const chatServerSvc = (input: ChatServerSvcInput, language?: string) => {
  const payload = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `
        User's native language is Spanish.
        I want you to act as a spoken English teacher and improver.
        If user speak to you in English and you will reply to him in English to practice my spoken English.
        If user speak to you in Spanish and you will reply to him in Spanish.
        I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. 
        I want you to ask me a question in your reply. Now let's start practicing, you could ask me a question first. 
        Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.
        
        The user last language was in: {${language}}.`,
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

  return fetch(URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(payload),
  });
};
