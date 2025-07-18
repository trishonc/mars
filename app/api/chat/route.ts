import { runResearchAgent } from '@/ai/lead-agent/agent';
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
        await runResearchAgent(messages, writer, abortSignal);
      } catch (e) {
        writer.write({ type: 'error', errorText: (e as Error).message });
      } finally {
        writer.write({ type: 'finish' });
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}