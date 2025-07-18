export interface SourceWithContent {
  url: string;
  content: string;
  title?: string;
}

export interface ResearchState {
  sources: SourceWithContent[];
  plan: string | null;
  report: string | null;
}

// Global research state
export let researchState: ResearchState = {
  sources: [],
  plan: null,
  report: null,
};

export const initializeResearchState = (): void => {
  researchState = {
    sources: [],
    plan: null,
    report: null,
  };
}; 