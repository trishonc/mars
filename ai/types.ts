import { webSearchTool, webFetchTool, savePlanTool, readPlanTool, completeTaskTool } from './tools';
import { InferToolOutput, InferToolInput, InferUITools, UIMessage } from 'ai';

const tools = {
  web_search: webSearchTool,
  web_fetch: webFetchTool,
  save_plan: savePlanTool,
  read_plan: readPlanTool,
  complete_task: completeTaskTool,
}

type MyUITools = InferUITools<typeof tools>;

export interface Source {
  url: string;
  title?: string;
  content?: string;
}

export interface ResearchState {
  sources: Source[];
  plan: string | null;
  report: string | null;
}


export type WebSearchTool = {
  toolName: 'web_search';
  toolCallId: string;
  input: InferToolInput<typeof webSearchTool>;
  output: InferToolOutput<typeof webSearchTool>;
}

export type WebFetchTool = {
  toolName: 'web_fetch';
  toolCallId: string;
  input: InferToolInput<typeof webFetchTool>;
  output: InferToolOutput<typeof webFetchTool>;
}

export type SubAgentToolCall = WebSearchTool | WebFetchTool;

export type MyUIMessage = UIMessage<
  never,
  {
    subagent: {
      title: string;
      state: 'streaming' | 'done';
      toolCalls: SubAgentToolCall[];
    };
    report: {
      report: string;
      sources: Source[];
      phase: 'synthesizing' | 'citations' | 'finished';
    }
  },
  MyUITools
>;
  


