import { smoothStream, streamText, UIMessageStreamWriter } from 'ai';
import { CITATIONS_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG } from '../config';
import { Source, MyUIMessage } from '../types';

export async function runCitationsAgent(
  sources: Source[],
  report: string,
  writer: UIMessageStreamWriter<MyUIMessage>,
  abortSignal?: AbortSignal
): Promise<void> {
  console.log(`Total sources collected during research: ${sources.length}`);
  
  if (!report) {
    console.error('No report provided to citations agent');
    return;
  }

  // Adding citations phase
  writer.write({
    type: 'data-report',
    data: {
      phase: 'citations',
      report: '',
      sources: sources.map(({ url, title }) => ({ url, title })),
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
    ${report}
    </synthesized_text>

    <sources>
    ${sources.map((source, index) => 
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
    onError(error) {
      console.error(error);
    },
  });

  let reportWithCitations = '';

  for await (const part of citationsResult.fullStream) {
    if (part.type === 'text-delta') {
      writer.write({
        type: 'data-report',
        data: {
          phase: 'citations',
          report: reportWithCitations += part.text,
          sources: sources.map(({ url, title }) => ({ url, title })),
        },
        id: 'data-report',
      });
    }
  }

  writer.write({
    type: 'data-report',
    data: {
      phase: 'finished',
      report: reportWithCitations,
      sources: sources.map(({ url, title }) => ({ url, title })),
    },
    id: 'data-report',
  });
} 