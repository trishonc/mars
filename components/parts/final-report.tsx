'use client';

import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Streamdown } from 'streamdown';
import { CitationsCard } from '@/components/citations-card';
import { Sparkles, FileText, FileCheck } from 'lucide-react';
import { Source } from '@/ai/types';
import { type ComponentType } from 'react';
import rehypeRaw from 'rehype-raw';

interface FinalReportProps {
  text: string;    
  sources: Source[];
  phase: 'synthesizing' | 'citations' | 'finished';
}

export function FinalReport({ text, sources, phase }: FinalReportProps) {
  const getHeaderContent = () => {
    switch (phase) {
      case 'synthesizing':
        return (
          <>
            <Sparkles className="size-4 text-muted-foreground flex-shrink-0 animate-pulse" />
            <span className="text-sm">Synthesizing...</span>
          </>
        );
      case 'citations':
        return (
          <>
            <FileText className="size-4 text-muted-foreground flex-shrink-0 animate-pulse" />
            <span className="text-sm">Generating report...</span>
          </>
        );
      case 'finished':
        return (
          <>
            <FileCheck className="size-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Final Report</span>
          </>
        );
    }
  };

  return (
      <Card className="p-0 w-full">
        <Accordion type="single" collapsible defaultValue="final-report">
          <AccordionItem value="final-report" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-3 w-full min-w-0">
                {getHeaderContent()}
              </div>
            </AccordionTrigger>
            {text && (
              <AccordionContent>
                <div className="px-4">
                  <div className="prose prose-sm max-w-none text-card-foreground">
                    <Streamdown
                      rehypePlugins={[rehypeRaw]}
                      parseIncompleteMarkdown={true}
                      components={
                        {
                          cite: ({ children, ...props }: any) => {
                            if (!children) return null;

                            const citationNumber = Number(String(children).trim());
                            if (!Number.isInteger(citationNumber) || citationNumber < 1) return null;

                            const source = sources?.[citationNumber - 1];
                            if (!source) return null;
                            return (
                              <CitationsCard
                                citationNumber={citationNumber}
                                url={source.url}
                                title={source.title || 'Untitled'}
                                {...props}
                              />
                            );
                          },
                        } as Record<string, ComponentType<unknown>>
                      }
                    >
                      {text}
                    </Streamdown>
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      </Card>
  );
}
