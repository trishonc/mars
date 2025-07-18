import { tool, streamText, UIMessageStreamWriter, stepCountIs, hasToolCall, smoothStream } from 'ai';
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { z } from 'zod';
import { webSearchTool, webFetchTool, completeTaskTool } from '../tools';
import { SUB_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG, AGENT_CONFIG } from '../config';

export const runSubAgentTool = (writer: UIMessageStreamWriter, abortSignal?: AbortSignal) => tool({
  description:
    'Spawn a subagent to research a subtopic. Use this to research a subtopic in depth with specific instructions.',
  inputSchema: z.object({
    taskName: z.string().describe('The subtopic to research.'),
    taskDescription: z.string().describe('Detailed instructions for the subagent including: research objective, desired output format, source preferences, task boundaries, and narrative angle. Be specific about what you want the subagent to focus on and avoid.'),
  }),
  execute: async ({ taskName, taskDescription }, { toolCallId }) => {
    console.log(`Running subagent with taskName: "${taskName}"`);
    console.log(`Instructions: "${taskDescription}"`);

    writer.write({ 
      type: 'data-subagent',
      data: {
        title: taskName,
        state: 'streaming',
        toolCalls: [],
      },
      id: toolCallId,
    });
    
    try {
      const subagentResult = await streamText({
        model: google(MODEL_CONFIG.SUB_AGENT_MODEL),
        system: SUB_AGENT_PROMPT,
        prompt: `Research the following task: ${taskName}

HERE IS THE TASK DESCRIPTION FROM LEAD AGENT:
${taskDescription}

Follow these instructions carefully while applying your research methodology. Use the search tool to gather information, crawl relevant URLs, and then call complete_task with your synthesized report.`,
        tools: {
          web_search: webSearchTool,
          web_fetch: webFetchTool,
          complete_task: completeTaskTool,
        },
        abortSignal,
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: 2048,
            },
          } satisfies GoogleGenerativeAIProviderOptions,
        },
        stopWhen: [
          stepCountIs(AGENT_CONFIG.SUBAGENT_MAX_STEPS),
          hasToolCall('complete_task'),
        ],
        prepareStep: async ({ stepNumber }) => {
          if (stepNumber === AGENT_CONFIG.SUBAGENT_MAX_STEPS - 1) {
            return {
              toolChoice: { type: 'tool', toolName: 'complete_task' },
            };
          }
        },
        experimental_transform: smoothStream({ chunking: /.{1}/g }),
      });

      let toolCalls: any[] = [];
      
      for await (const part of subagentResult.fullStream) {
        
        if (part.type === 'tool-result' && part.toolName === 'web_search') {
          toolCalls.push({
            type: 'web_search',
            query: part.input.query,
            results: part.output?.results && Array.isArray(part.output.results) ? part.output.results : [],
          });

          writer.write({ 
            type: 'data-subagent',
            data: {
              title: taskName,
              state: 'streaming',
              toolCalls: [...toolCalls],
            },
            id: toolCallId,
          });
        }
        if (part.type === 'tool-result' && part.toolName === 'web_fetch') {
          toolCalls.push({
            type: 'web_fetch',
            url: part.input.url,
            title: part.output?.title,
          });

          writer.write({ 
            type: 'data-subagent',
            data: {
              title: taskName,
              state: 'streaming',
              toolCalls: [...toolCalls],
            },
            id: toolCallId,
          });
        }
        if (part.type === 'tool-result' && part.toolName === 'complete_task') {
          writer.write({ 
            type: 'data-subagent',
            data: {
              title: part.input.title,
              state: 'done',
              toolCalls: [...toolCalls],
            },
            id: toolCallId,
          });
        }
      }

      const subagentToolCalls = await subagentResult.toolCalls;
      const completionCall = subagentToolCalls.find(
        (call) => call.toolName === 'complete_task'
      );
      
      if (completionCall?.input) {
        console.log('Subagent research completed and report generated.');
        const finalReport = (completionCall.input as { report: string }).report;
      
        return { 
          report: finalReport,
        };
      }

      console.log('Subagent finished without a completion task.');
      
      return {
        report: `The sub-agent completed its research on "${taskName}" but did not generate a final report.`,
      };
    } catch (error) {
      console.error('Error in subagent execution:', error);
      
      return {
        report: `An error occurred while researching "${taskName}". Please try again.`,
      };
    }
  },
}); 