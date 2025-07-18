import { streamText, UIMessage, convertToModelMessages, UIMessageStreamWriter, stepCountIs, hasToolCall, smoothStream } from 'ai';
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { researchState } from '../research-state';
import { completeTaskTool, savePlanTool, readPlanTool } from '../tools';
import { runSubAgentTool } from '../sub-agent/agent';
import { runCitationsAgent } from '../citations-agent/agent';
import { LEAD_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG, AGENT_CONFIG } from '../config';

export async function runResearchAgent(messages: UIMessage[], writer: UIMessageStreamWriter, abortSignal?: AbortSignal) {
  const tools = {
    run_subagent: runSubAgentTool(writer, abortSignal),
    complete_task: completeTaskTool,
    save_plan: savePlanTool,
    read_plan: readPlanTool,
  };
  
  const leadAgentResult = await streamText({
    model: google(MODEL_CONFIG.LEAD_AGENT_MODEL),
    system: LEAD_AGENT_PROMPT,
    messages: convertToModelMessages(messages),
    tools,
    abortSignal,
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: 2048,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
    experimental_transform: smoothStream({ chunking: /.{1}/g }),
    stopWhen: [
      stepCountIs(AGENT_CONFIG.LEAD_AGENT_MAX_STEPS),
      hasToolCall('complete_task'),
    ],
    prepareStep: async ({ stepNumber }) => {
      if (stepNumber === 0) {
        return {
          toolChoice: { type: 'tool', toolName: 'save_plan' },
        };
      }
      if (stepNumber === AGENT_CONFIG.LEAD_AGENT_MAX_STEPS - 1) {
        return {
          toolChoice: { type: 'tool', toolName: 'complete_task' },
        };
      }
    },
  });

  writer.merge(leadAgentResult.toUIMessageStream({
    sendReasoning: true,
    sendStart: false,
    sendFinish: false,
  }));

  const leadToolCalls = await leadAgentResult.toolCalls;
  const finalReportOutput = leadToolCalls.find((call) => call.toolName === 'complete_task')?.input;
  
  if (!finalReportOutput?.report) {
      return;
  }

  // Save final report to research state
  researchState.report = finalReportOutput.report;

  await runCitationsAgent(writer, abortSignal);
} 