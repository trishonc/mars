'use client';

import { cn } from "@/lib/utils";
import { SubAgent } from './parts/sub-agent';
import { Reasoning } from './parts/reasoning';
import { CreatePlan } from './parts/create-plan';
import { FinalReport } from './parts/final-report';
import { Text } from './parts/text';
import { MyUIMessage } from '@/ai/types';

interface MessageProps {
  message: MyUIMessage;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

export function Message({ message, status }: MessageProps) {
  const alignmentClass = message.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start';

  return (
    <div className="w-full px-4 py-2 max-w-3xl mx-auto">
      <div
        className={cn(
          "flex flex-col space-y-2 max-w-[80%]",
          alignmentClass,
        )}
      >
        {message.parts.map((part, i) => {
          const key = `${message.id}-${i}`;
          switch (part.type) {
            case 'text':
              return (
                <Text
                  key={key}
                  text={part.text}
                />
              );
            case 'reasoning':
              return (
                <Reasoning
                  key={key}
                  text={part.text}
                  state={status === 'ready' ? 'done' : part.state}
                />
              );
            case 'data-subagent':
              return (
                <SubAgent
                  key={key}
                  id={key}
                  title={part.data.title}
                  toolCalls={part.data.toolCalls}
                  state={status === 'ready' ? 'done' : part.data.state}
                />
              );
            case 'data-report':
              return (
                <FinalReport
                  key={key}
                  text={part.data.report}
                  sources={part.data.sources}
                  phase={part.data.phase}
                />
              );
            case 'tool-create_plan':
              return (
                <CreatePlan 
                  key={key}
                  state={status === 'ready' ? 'input-available' : part.state}
                  plan={part.input?.plan}
                  errorText={part.errorText}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
