"use server";

import { LLMInput } from "@/types";
import { LLMClient } from "@/clients/llm.client";

export const llmAct = async (input: LLMInput) => {
  return LLMClient.getInstance().chat(input);
};
