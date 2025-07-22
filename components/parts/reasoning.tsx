'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, Clock } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Markdown } from '../markdown';

interface ReasoningProps {
  text: string;
  state?: 'streaming' | 'done';
}

export function Reasoning({ text, state }: ReasoningProps) {
  const startTimeRef = useRef<number | null>(null);
  const [duration, setDuration] = React.useState<number | null>(null);
  // Track when thinking starts
  useEffect(() => {
    if (state === 'streaming' && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    } else if (state === 'done' && startTimeRef.current !== null) {
      const endTime = Date.now();
      const thinkingDuration = Math.round((endTime - startTimeRef.current) / 1000);
      setDuration(thinkingDuration);
      startTimeRef.current = null;
    }
  }, [state]);

  const getHeaderContent = () => {
    if (state === 'streaming') {
      return (
        <>
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-spin" />
          <span className="text-sm">Thinking...</span>
        </>
      );
    } else if (state === 'done' && duration !== null) {
      return (
        <>
          <Brain className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm">Thought for {duration} second{duration !== 1 ? 's' : ''}</span>
        </>
      );
    } else {
      return (
        <>
          <Brain className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm">Thinking...</span>
        </>
      );
    }
  };
  
  return (
    <Card className="p-0">
      <Accordion type="single" collapsible>
        <AccordionItem value="reasoning" className="border-none">
          <AccordionTrigger className="hover:no-underline px-4 py-3">
            <div className="flex items-center gap-3 w-full min-w-0">
              {getHeaderContent()}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4">
              {text && (
                  <div className="prose prose-sm max-w-none">
                    <div className="text-card-foreground">
                      <Markdown>{text}</Markdown>
                    </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
