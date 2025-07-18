// Search Configuration
export const SEARCH_CONFIG = {
  MAX_SEARCH_RESULTS: 5,        // Maximum search results from Exa
} as const;

// Model Configuration  
export const MODEL_CONFIG = {
  LEAD_AGENT_MODEL: "gemini-2.5-flash",
  SUB_AGENT_MODEL: "gemini-2.5-flash",
  CITATIONS_MODEL: "gemini-2.5-flash",
  TEMPERATURE: 0.7,                   // Model temperature
} as const;

// Agent Configuration
export const AGENT_CONFIG = {
  LEAD_AGENT_MAX_STEPS: 3,      // Maximum steps for lead agent
  SUBAGENT_MAX_STEPS: 3,         // Maximum steps for subagent
} as const;
