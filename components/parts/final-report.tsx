import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Markdown } from '../markdown';
import { Bot, Clock, FileCheck } from 'lucide-react';

interface FinalReportProps {
  id: string;
  state: string;
  text?: string;    
  errorText?: string;
}

export function FinalReport({ id, state, text, errorText }: FinalReportProps) {
  const callId = id;

  const getHeaderContent = () => {
    switch (state) {
      case 'input-streaming':
        return (
            <>
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-spin" />
              <span className="text-sm">Adding citations...</span>
            </>
          );
      case 'input-available':
        return (
          <>
            <FileCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Final Report Complete</span>
          </>
        );
      default:
        return (
          <>
            <FileCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Final Report</span>
          </>
        );
    }
  };

  return (
    <Card key={callId} className="p-0">
      <Accordion type="single" collapsible>
        <AccordionItem value="final-report" className="border-none">
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
