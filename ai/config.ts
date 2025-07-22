import { openai } from '@ai-sdk/openai';

export const SEARCH_CONFIG = {
  MAX_SEARCH_RESULTS: 5,
} as const;

// Model and Provider Configuration  
export const MODEL_CONFIG = {
  LEAD_AGENT_MODEL: openai("gpt-4.1-mini"),
  SUB_AGENT_MODEL: openai("gpt-4.1-mini"),
  CITATIONS_MODEL: openai("gpt-4.1-mini"),
  PROVIDER_OPTIONS: {
    openai: {
      reasoningEffort: "low",
      // reasoningSummary: "auto",
    },
  },
  // PROVIDER_OPTIONS: {
  //   google: {
  //     thinkingConfig: {
  //       includeThoughts: true,
  //       thinkingBudget: 2048,
  //     },
  //   },
  // },
  TEMPERATURE: 1.0,
  MAX_OUTPUT_TOKENS: 65536,
} as const;

export const AGENT_CONFIG = {
  LEAD_AGENT_MAX_STEPS: 3,
  SUBAGENT_MAX_STEPS: 3,
} as const;
