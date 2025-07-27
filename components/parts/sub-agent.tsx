'use client';

import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Check } from 'lucide-react';
import React from 'react';
import { WebSearch } from './web-search';
import { WebFetch } from './web-fetch';
import { SubAgentToolCall } from '@/ai/types';

interface SubAgentProps {
  id: string;
  title: string;
  toolCalls: SubAgentToolCall[];
  state: 'streaming' | 'done';
}

export function SubAgent({ id, title, toolCalls, state }: SubAgentProps) {
  const sourceCount = toolCalls.filter(call => call.toolName === 'web_fetch').length;

  return (
      <Card className="p-0 w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value={id} className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-3 w-full min-w-0">
                <div className="flex-shrink-0">
                  {state === 'streaming' ? (
                    <Loader2 className="size-4 text-primary animate-spin" />
                  ) : (
                    <Check className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-base font-semibold break-word">{title}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {sourceCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {sourceCount} source{sourceCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            {toolCalls.length > 0 && (
              <AccordionContent>
                <div className="px-4">
                  <div className="space-y-2">
                    {toolCalls.map((toolCall, index) => {
                      if (toolCall.toolName === 'web_search') {
                        return (
                          <WebSearch 
                            key={toolCall.toolCallId}
                            query={toolCall.input.query}
                            results={toolCall.output.results || []}
                            subAgentId={id}
                            searchIndex={index}
                          />
                        );
                      } else if (toolCall.toolName === 'web_fetch') {
                        return (
                          <WebFetch 
                            key={toolCall.toolCallId}
                            url={toolCall.input.url}
                            title={toolCall.output.title || ''}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      </Card>
  );
}
