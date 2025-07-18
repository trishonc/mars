export const SEARCH_CONFIG = {
  MAX_SEARCH_RESULTS: 5,
} as const;

// Model Configuration  
export const MODEL_CONFIG = {
  LEAD_AGENT_MODEL: "gemini-2.5-flash",
  SUB_AGENT_MODEL: "gemini-2.5-flash",
  CITATIONS_MODEL: "gemini-2.5-flash",
  TEMPERATURE: 1.0,
  MAX_OUTPUT_TOKENS: 65536,
} as const;

export const AGENT_CONFIG = {
  LEAD_AGENT_MAX_STEPS: 3,
  SUBAGENT_MAX_STEPS: 3,
} as const;
