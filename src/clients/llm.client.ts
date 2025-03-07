import { LLMClientBase } from "@/types";
import { LLMOpenRouter } from "@/services/llm-openrouter.service";
import LLMConfigs from "@/config/llm.json";
import { LLMLmStudio } from "@/services/llm-lmstudio.service";

export class LLMClient {
  private static instance: LLMClientBase;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      console.log("LLM instance already setted");

      return this.instance;
    }

    const providerConfig = LLMConfigs.find(
      (providerConfig) => providerConfig.isActive
    );

    if (!providerConfig) {
      throw new Error("No LLM Provider configured");
    }

    switch (providerConfig.provider) {
      case "openrouter":
        console.log("Setting LLM OpenRouter");

        this.instance = new LLMOpenRouter({
          model: providerConfig.model,
        });

        break;

      case "lmstudio":
        console.log("Setting LM Studio");

        this.instance = new LLMLmStudio({
          model: providerConfig.model,
          baseUrl: providerConfig.baseUrl as string,
        });

        break;

      default:
        throw new Error("Invalid LLM Provider config");
    }

    return this.instance;
  }
}
