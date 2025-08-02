import { tool } from 'ai';
import { z } from 'zod';
import Exa from 'exa-js';
import { SEARCH_CONFIG } from './config';

const exa = new Exa(process.env.EXA_API_KEY);

export const webSearchTool = tool({
  description:
    'Search the web for information. Use this to for information about recent events or information not in your knowledge base.',
  inputSchema: z.object({
    query: z.string().describe('The search query to use.'),
  }),
  outputSchema: z.object({
    message: z.string(),
    results: z.array(z.any()).nullable(),
  }),
  execute: async ({ query }) => {
    try {
      console.log(`Executing search tool with query: "${query}"`);

      const response= await exa.search(query, {
        numResults: SEARCH_CONFIG.MAX_SEARCH_RESULTS,
        type: 'keyword',
        useAutoprompt: true,
        // startPublishedDate: '2025-01-01',
        // endPublishedDate '2025-07-28',
        // category: 'news',
      });
      
      const searchResults = response.results || [];

      if (searchResults.length === 0) {
        return { message: 'No search results found.', results: null };
      }
      
      return { message: `Found ${searchResults.length} search results.`, results: searchResults };
    } catch (error) {
      console.error('Error executing search tool:', error);
      return { message: 'An error occurred while searching the web.', results: null };
    }
  },
});

export const webFetchTool = tool({
  description: 'Fetch a URL to get its content.',
  inputSchema: z.object({
    url: z.string().describe('The URL to fetch.'),
  }),
  outputSchema: z.object({
    message: z.string(),
    content: z.string().nullable(),
    title: z.string().nullable(),
  }),
  execute: async ({ url }) => {
    try {
      const response = await exa.getContents([url], { text: true, livecrawl: 'preferred'});
      
      let content: string | null = null;
      let title: string | null = null;

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        content = result.text;
        title = result.title;
      }

      if (content) {
        console.log(`Successfully fetched content from: ${url}`);
        return { message: 'Successfully fetched content.', content, title };
      }
      
      return { message: 'No content found at the URL.', content: null, title };
    } catch (error) {
      console.error(`Error executing web fetch tool for ${url}:`, error);
      return { message: `An error occurred while fetching ${url}.`, content: null, title: null };
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

export const createPlanTool = tool({
  description: 'Create a research plan based on the current research task.',
  inputSchema: z.object({
    plan: z.string().describe('The research plan written in markdown format, including strategy, subagent tasks, and expected outcomes.'),
  }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ plan }) => {
    return { message: 'Plan created successfully' };
  },
});