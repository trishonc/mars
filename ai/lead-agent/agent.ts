import { streamText, UIMessage, convertToModelMessages, UIMessageStreamWriter, stepCountIs, hasToolCall, smoothStream} from 'ai';
import { completeTaskTool, createPlanTool } from '../tools';
import { runSubAgentTool } from '../sub-agent/agent';
import { LEAD_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG, AGENT_CONFIG } from '../config';
import { Source } from '../types';

export async function runResearchAgent(messages: UIMessage[], writer: UIMessageStreamWriter, abortSignal?: AbortSignal) {
  let allSources: Source[] = [];

  const tools = {
    run_subagent: runSubAgentTool(writer),
    complete_task: completeTaskTool,
    create_plan: createPlanTool,
  };
  
  const leadAgentResult = await streamText({
    model: MODEL_CONFIG.LEAD_AGENT.model,
    system: LEAD_AGENT_PROMPT,
    messages: convertToModelMessages(messages),
    tools,
    abortSignal,
    temperature: MODEL_CONFIG.TEMPERATURE,
    maxOutputTokens: MODEL_CONFIG.MAX_OUTPUT_TOKENS,
    providerOptions: MODEL_CONFIG.LEAD_AGENT.providerOptions,
    experimental_transform: [
      smoothStream({ chunking: /.{1}/g }),
    ],
    stopWhen: [
      stepCountIs(AGENT_CONFIG.LEAD_AGENT_MAX_STEPS),
      hasToolCall('complete_task'),
    ],
    prepareStep: async ({ stepNumber }) => {
      if (stepNumber === 0) {
        return {
          toolChoice: { type: 'tool', toolName: 'create_plan' },
        };
      }
      if (stepNumber === AGENT_CONFIG.LEAD_AGENT_MAX_STEPS - 1) {
        return {
          toolChoice: { type: 'tool', toolName: 'complete_task' },
        };
      }
    },
    onChunk({ chunk }) {
      if (chunk.type === 'tool-input-start' && chunk.toolName === 'complete_task') {
        writer.write({
          type: 'data-report',
          data: {
            phase: 'synthesizing',
            report: '',
            sources: [],
          },
          id: 'data-report',
        });
      }
    },
    onError(error) {
      console.error(error);
    },
  });

  writer.merge(leadAgentResult.toUIMessageStream({
    sendReasoning: true,
    sendStart: false,
    sendFinish: false,
  }));

  
  const leadToolCalls = (await leadAgentResult.steps).flatMap(step => step.toolCalls ?? []);
  const leadToolResults = (await leadAgentResult.steps).flatMap(step => step.toolResults ?? []);
  
  const subagentResults = leadToolResults.filter((result) => result.toolName === 'run_subagent');
  for (const subagentResult of subagentResults) {
    if (subagentResult.output?.sources) {
      const newSources = subagentResult.output.sources.filter(
        (source: { url: string }) => !allSources.some(e => e.url === source.url)
      );
      allSources.push(...newSources);
    }
  }

  const finalReportToolCall = leadToolCalls.find((call) => call.toolName === 'complete_task');
  const report = finalReportToolCall?.input.report;

  console.log(`Lead agent collected ${allSources.length} total sources from all subagents`);
  
  return {
    sources: allSources,
    report: report,
  };
} 