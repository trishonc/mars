import { streamText, UIMessageStreamWriter, hasToolCall, smoothStream } from 'ai';
import { google } from '@ai-sdk/google';
import { researchState } from '../research-state';
import { completeReportTool } from '../tools';
import { CITATIONS_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG } from '../config';

export async function runCitationsAgent(writer: UIMessageStreamWriter, abortSignal?: AbortSignal): Promise<void> {
  console.log(`Total sources collected during research: ${researchState.sources.length}`);
  
  if (!researchState.report) {
    console.error('No report found in research state');
    return;
  }

  const uniqueSources = researchState.sources.filter((source, index, self) => 
    index === self.findIndex(s => s.url === source.url)
  );

  const citationResult = await streamText({
    model: google(MODEL_CONFIG.CITATIONS_MODEL),
    system: CITATIONS_AGENT_PROMPT,
    prompt: `Here is the synthesized text and sources collected during research:

<synthesized_text>
${researchState.report}
</synthesized_text>

<sources>
${uniqueSources.map((source, index) => 
  `[${index + 1}] ${source.title ? source.title + ' - ' : ''}${source.url}\n${source.content}`
).join('\n\n---\n\n')}
</sources>
`,
    tools: {
      complete_report: completeReportTool,
    },
    toolChoice: 'required',
    abortSignal,
    experimental_transform: smoothStream({ chunking: /.{1}/g }),
    stopWhen: [hasToolCall('complete_report')],
  });
  
  writer.merge(citationResult.toUIMessageStream({
    sendReasoning: true,
    sendStart: false,
    sendFinish: false,
  }));
} 