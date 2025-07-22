import { runResearchAgent } from '@/ai/lead-agent/agent';
import { runCitationsAgent } from '@/ai/citations-agent/agent';
import { initResearchState } from '@/ai/research-state';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const abortSignal = req.signal;

  const stream = createUIMessageStream({
    async execute({ writer }) {
      initResearchState();
      
      writer.write({ type: 'start' });
      
      try {
        // Step 1: Run the research agent
        await runResearchAgent(messages, writer, abortSignal);
        
        // Step 2: Run the citations agent
        await runCitationsAgent(writer, abortSignal);
      } catch (e) {
        writer.write({ type: 'error', errorText: (e as Error).message });
      } finally {
        writer.write({ type: 'finish' });
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}