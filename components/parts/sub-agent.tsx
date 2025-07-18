'use client';

import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';
import { WebSearch } from './web-search';
import { WebFetch } from './web-fetch';

interface SearchResult {
  url: string;
  title?: string;
  text?: string;
}

interface WebSearchToolCall {
  type: 'web_search';
  query?: string;
  results?: SearchResult[];
}

interface WebFetchToolCall {
  type: 'web_fetch';
  url?: string;
  title?: string;
}

type ToolCall = WebSearchToolCall | WebFetchToolCall;

interface SubAgentProps {
  id: string;
  title: string;
  toolCalls: ToolCall[];
  state: 'streaming' | 'done';
}

export function SubAgent({ id, title, toolCalls, state }: SubAgentProps) {
  const sourceCount = toolCalls.filter(call => call.type === 'web_fetch').length;
  
  const renderToolCall = (toolCall: ToolCall, index: number) => {
    if (toolCall.type === 'web_search') {
      return (
        <WebSearch 
          key={`${id}-tool-${index}`}
          query={toolCall.query}
          results={toolCall.results || []}
          subAgentId={id}
          searchIndex={index}
        />
      );
    } else if (toolCall.type === 'web_fetch') {
      return (
        <WebFetch 
          key={`${id}-tool-${index}`}
          url={toolCall.url!}
          title={toolCall.title}
        />
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full p-0">
      <Accordion type="single" collapsible>
        <AccordionItem value={id} className="border-none">
          <AccordionTrigger className="hover:no-underline px-4 py-3">
            <div className="flex items-center gap-3 w-full min-w-0">
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
          <AccordionContent>
            <div className="px-4">
              <div className="space-y-2">
                {toolCalls.map((toolCall, index) => renderToolCall(toolCall, index))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
