import { smoothStream, streamText, UIMessageStreamWriter } from 'ai';
import { researchState } from '../research-state';
import { CITATIONS_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG } from '../config';

export async function runCitationsAgent(writer: UIMessageStreamWriter, abortSignal?: AbortSignal): Promise<void> {
  console.log(`Total sources collected during research: ${researchState.sources.length}`);
  
  if (!researchState.report) {
    console.error('No report found in research state');
    return;
  }

  // Adding citations phase
  writer.write({
    type: 'data-report',
    data: {
      phase: 'citations',
      sources: researchState.sources.map(({ url, title }) => ({ url, title })),
    },
    id: 'data-report',
  });

  console.log('Adding citations...');

  // Generate complete report with citations
  const citationsResult = await streamText({
    model: MODEL_CONFIG.CITATIONS.model,
    system: CITATIONS_AGENT_PROMPT,
    prompt: `Here is the synthesized text and sources collected during research:

    <synthesized_text>
    ${researchState.report}
    </synthesized_text>

    <sources>
    ${researchState.sources.map((source, index) => 
      `[${index + 1}] ${source.title ? source.title + ' - ' : ''}${source.url}\n${source.content}`
    ).join('\n\n---\n\n')}
    </sources>
    `,
    abortSignal,
    temperature: MODEL_CONFIG.TEMPERATURE,
    maxOutputTokens: MODEL_CONFIG.MAX_OUTPUT_TOKENS,
    providerOptions: MODEL_CONFIG.CITATIONS.providerOptions,
    experimental_transform: [
      smoothStream({ chunking: /.{1}/g }),
    ],
  });

  let report = '';

  for await (const part of citationsResult.fullStream) {
    if (part.type === 'text') {
      writer.write({
        type: 'data-report',
        data: {
          report: report += part.text,
        },
        id: 'data-report',
      });
    }
  }

  // Final report complete
  writer.write({
    type: 'data-report',
    data: {
      phase: 'finished',
    },
    id: 'data-report',
  });
} 