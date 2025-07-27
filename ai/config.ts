import { openai } from '@ai-sdk/openai';

export const SEARCH_CONFIG = {
  MAX_SEARCH_RESULTS: 5,
} as const;

export const MODEL_CONFIG = {
  LEAD_AGENT: {
    model: openai("gpt-4.1-mini"),
    providerOptions: {
      openai: {},
    },
  },
  SUB_AGENT: {
    model: openai("gpt-4.1-mini"),
    providerOptions: {
      openai: {},
    },
  },
  CITATIONS: {
    model: openai('gpt-4.1-mini'),
    providerOptions: {
      openai: {},
    },
  },
  TEMPERATURE: 1.0,
  MAX_OUTPUT_TOKENS: 65536,
} as const;

export const AGENT_CONFIG = {
  LEAD_AGENT_MAX_STEPS: 3,
  SUBAGENT_MAX_STEPS: 3,
} as const;
