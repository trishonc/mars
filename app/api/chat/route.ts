import { runResearchAgent } from '@/ai/lead-agent/agent';
import { runCitationsAgent } from '@/ai/citations-agent/agent';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MyUIMessage } from '@/ai/types';

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();
  const abortSignal = req.signal;

  const stream = createUIMessageStream<MyUIMessage>({
    async execute({ writer }) {
      writer.write({ type: 'start' });
      
      try {
        // Step 1: Run the research agent and collect sources and report
        const researchResult = await runResearchAgent(messages, writer, abortSignal);
        
        // Step 2: Run the citations agent with collected data
        if (researchResult?.report && researchResult?.sources) {
          await runCitationsAgent(researchResult.sources, researchResult.report, writer, abortSignal);
        } else {
          console.error('Research agent did not return sources and report');
          writer.write({ type: 'error', errorText: 'Research completed but no report was generated' });
        }
      } catch (e) {
        writer.write({ type: 'error', errorText: (e as Error).message });
      } finally {
        writer.write({ type: 'finish' });
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}