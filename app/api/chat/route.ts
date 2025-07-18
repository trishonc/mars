import { runResearchAgent } from '@/ai/lead-agent/agent';
import { initializeResearchState } from '@/ai/research-state';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream({
    async execute({ writer }) {
      initializeResearchState();
      
      writer.write({ type: 'start' });
      
      try {
        await runResearchAgent(messages, writer, req.signal);
      } catch (e) {
        writer.write({ type: 'error', errorText: (e as Error).message });
      } finally {
        writer.write({ type: 'finish' });
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}