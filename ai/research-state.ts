import { ResearchState } from "./types";

export let researchState: ResearchState = {
  sources: [],
  plan: null,
  report: null,
};

export const initResearchState = (): void => {
  researchState = {
    sources: [],
    plan: null,
    report: null,
  };
}; 