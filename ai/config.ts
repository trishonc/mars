import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const SEARCH_CONFIG = {
  MAX_SEARCH_RESULTS: 5,
} as const;

// Model and Provider Configuration  
export const MODEL_CONFIG = {
  LEAD_AGENT: {
    model: openai("gpt-4.1-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        // reasoningSummary: "auto",
      },
    },
  },
  SUB_AGENT: {
    model: openai("gpt-4.1-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        // reasoningSummary: "auto",
      },
    },
  },
  CITATIONS: {
    model: google("gemini-2.5-flash-lite"),
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: 0,
        },
      },
    },
  },
  TEMPERATURE: 1.0,
  MAX_OUTPUT_TOKENS: 65536,
} as const;

export const AGENT_CONFIG = {
  LEAD_AGENT_MAX_STEPS: 3,
  SUBAGENT_MAX_STEPS: 3,
} as const;
