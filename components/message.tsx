'use client';

import { cn } from "@/lib/utils";
import { Markdown } from './markdown';
import { SubAgent } from './parts/sub-agent';
import { Reasoning } from './parts/reasoning';
import { SavePlan } from './parts/save-plan';
import { ReadPlan } from './parts/read-plan';
import { FinalReport } from './parts/final-report';
import { Card, CardContent } from '@/components/ui/card';

interface MessageProps {
  message: any;
  status: string;
}

export function Message({ message, status }: MessageProps) {
  const renderPart = (part: any, messageId: string, partIndex: number) => {
    const key = `${messageId}-${partIndex}`;

    switch (part.type) {
      case 'text':
        return (
          <Card key={key} className="w-fit p-0">
            <CardContent className="px-4 py-3">
              <Markdown>{part.text}</Markdown>
            </CardContent>
          </Card>
        );

      case 'reasoning':
        return (
          <div key={key} className="w-full">
            <Reasoning
              text={part.text}
              state={status === 'ready' ? 'done' : part.state}
            />
          </div>
        );

      case 'data-subagent':
        return (
          <div key={key} className="w-full">

            <SubAgent
              id={part.id}
              title={part.data.title}
              toolCalls={part.data.toolCalls}
              state={status === 'ready' ? 'done' : part.data.state}
            />
          </div>
        );

      case 'data-report':
        return (
          <div key={key} className="w-full">
            <FinalReport
              id={part.id}
              text={part.data.report}
              sources={part.data.sources}
              errorText={part.errorText}
              phase={part.data.phase}
            />
          </div>
        );
      
      // case 'tool-complete_task':
      //   switch(part.state) {
      //     case 'input-streaming':
      //       console.log('input-streaming', part.input);
      //     case 'input-available':
      //       console.log('input-available', part.input);
      //   }

      case 'tool-save_plan':
        return (
          <div key={key} className="w-full">
            <SavePlan 
              id={part.id}
              state={status === 'ready' ? 'done' : part.state}
              plan={part.input?.plan}
              output={part.output?.message}
              errorText={part.errorText}
            />
          </div>
        );

      case 'tool-read_plan':
        return (
          <div key={key} className="w-full">
            <ReadPlan 
              id={part.id}
              state={status === 'ready' ? 'done' : part.state}
              plan={part.output?.plan}
              output={part.output?.message}
              errorText={part.errorText}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  const alignmentClass = message.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start';

  return (
    <div className="w-full px-4 py-2 max-w-3xl mx-auto">
      <div
        className={cn(
          "flex flex-col space-y-2 max-w-[80%]",
          alignmentClass,
        )}
      >
        {message.parts.map((part: any, i: number) => renderPart(part, message.id, i))}
      </div>
    </div>
  );
}
