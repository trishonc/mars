import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MemoizedMarkdown } from '../markdown';
import { Sparkles, FileText, FileCheck } from 'lucide-react';
import { Source } from '@/ai/types';

interface FinalReportProps {
  id: string;
  text?: string;    
  sources?: Source[];
  phase?: 'synthesizing' | 'citations' | 'finished';
}

export function FinalReport({ id, text, sources, phase }: FinalReportProps) {
  const getHeaderContent = () => {
    switch (phase) {
      case 'synthesizing':
        return (
          <>
            <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-pulse" />
            <span className="text-sm">Synthesizing results...</span>
          </>
        );
      case 'citations':
        return (
          <>
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-pulse" />
            <span className="text-sm">Generating report...</span>
          </>
        );
      case 'finished':
        return (
          <>
            <FileCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Final Report</span>
          </>
        );
    }
  };

  return (
      <Card className="p-0 w-full">
        <Accordion type="single" collapsible value={text ? "final-report" : undefined}>
          <AccordionItem value="final-report" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-3 w-full min-w-0">
                {getHeaderContent()}
              </div>
            </AccordionTrigger>
            {text && (
              <AccordionContent>
                <div className="px-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-card-foreground">
                      <MemoizedMarkdown id={id} content={text} sources={sources} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      </Card>
  );
}
