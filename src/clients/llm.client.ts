import { LLMClientBase } from "@/types";
import { LLMOpenRouter } from "@/services/llm-openrouter.service";
import LLMConfigs from "@/config/llm.json";

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

      default:
        throw new Error("Invalid LLM Provider config");
    }

    return this.instance;
  }
}
