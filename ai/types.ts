import { webSearchTool, webFetchTool, createPlanTool, completeTaskTool } from './tools';
import { InferToolOutput, InferToolInput, InferUITools, UIMessage} from 'ai';

const tools = {
  web_search: webSearchTool,
  web_fetch: webFetchTool,
  create_plan: createPlanTool,
  complete_task: completeTaskTool,
}

type MyUITools = InferUITools<typeof tools>;

export interface Source {
  url: string;
  title?: string;
  content?: string;
}

export type WebSearchToolResult= {
  toolName: 'web_search';
  toolCallId: string;
  input: InferToolInput<typeof webSearchTool>;
  output: InferToolOutput<typeof webSearchTool>;
}

export type WebFetchToolResult = {
  toolName: 'web_fetch';
  toolCallId: string;
  input: InferToolInput<typeof webFetchTool>;
  output: InferToolOutput<typeof webFetchTool>;
}

export type SubAgentToolCall = WebSearchToolResult | WebFetchToolResult;

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
  


