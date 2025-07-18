import { tool } from 'ai';
import { z } from 'zod';
import Exa, { SearchResponse } from 'exa-js';
import { researchState } from './research-state';
import { SEARCH_CONFIG } from './config';

const exa = new Exa(process.env.EXA_API_KEY);

export const webSearchTool = tool({
  description:
    'Search the web for information. Use this to for information about recent events or information not in your knowledge base.',
  inputSchema: z.object({
    query: z.string().describe('The search query to use.'),
  }),
  execute: async ({ query }) => {
    try {
      console.log(`Executing search tool with query: "${query}"`);

      const response: SearchResponse<{}> = await exa.search(query, { 
        numResults: SEARCH_CONFIG.MAX_SEARCH_RESULTS,
        type: 'keyword',
        useAutoprompt: true,
      });
      
      const searchResults = response.results || [];

      if (searchResults.length === 0) {
        return { results: 'No search results found.' };
      }
      
      return { results: searchResults };
    } catch (error) {
      console.error('Error executing search tool:', error);
      return { results: 'An error occurred while searching the web.' };
    }
  },
});

export const webFetchTool = tool({
  description: 'Fetch a URL to get its content.',
  inputSchema: z.object({
    url: z.string().describe('The URL to fetch.'),
  }),
  execute: async ({ url }) => {
    try {
      // Check if this URL already exists in sources
      const existingSource = researchState.sources.find(source => source.url === url);
      if (existingSource) {
        console.log(`Source already exists in research state: ${url}`);
        return { results: existingSource.content, title: existingSource.title || null };
      }

      const response: SearchResponse<{ text: true }> = await exa.getContents([url], { text: true });
      
      let content: string | null = null;
      let title: string | null = null;
      console.log(response);
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        content = result.text || null;
        title = result.title || null;
      }

      if (content) {
        researchState.sources.push({
          url,
          content,
          title: title || undefined
        });
        console.log(`Added source to research state: ${url}. Total sources: ${researchState.sources.length}`);
      }
      return { results: content, title };
    } catch (error) {
      console.error(`Error executing web fetch tool for ${url}:`, error);
      return { results: `An error occurred while fetching ${url}.`, title: null };
    }
  }
});

export const completeTaskTool = tool({
  description: 'Signal that the current research task is complete and provide the final report.',
  inputSchema: z.object({
    title: z.string().describe('The title of the report based on the findings.'),
    report: z.string().describe('The final report in markdown format.'),
  })
});

export const completeReportTool = tool({
  description: 'Complete the final report with proper citations added.',
  inputSchema: z.object({
    exact_text_with_citations: z.string().describe('The final report text with citations added in the format [1], [2], etc.'),
  })
});

export const savePlanTool = tool({
  description: 'Save the current research plan to memory for later retrieval.',
  inputSchema: z.object({
    plan: z.string().describe('The research plan to save written in markdown format, including strategy, subagent tasks, and expected outcomes.'),
  }),
  execute: async ({ plan }) => {
    researchState.plan = plan;
    console.log(`Saved research plan: ${plan.substring(0, 100)}...`);
    return { message: 'Plan saved successfully' };
  },
});

export const readPlanTool = tool({
  description: 'Retrieve the previously saved research plan from memory.',
  inputSchema: z.object({}),
  execute: async ({}) => {
    if (!researchState.plan) {
      return { plan: null, message: 'No plan has been saved yet' };
    }
    console.log(`Retrieved research plan: ${researchState.plan.substring(0, 100)}...`);
    return { plan: researchState.plan, message: 'Plan retrieved successfully' };
  },
});
