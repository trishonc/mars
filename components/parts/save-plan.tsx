import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Markdown } from '../markdown';
import { Bot, Clock, FileText } from 'lucide-react';

interface SavePlanProps {
  id: string;
  state: string;
  plan?: string;   
  output?: string;
  errorText?: string;
}

export function SavePlan({ id, state, plan, output, errorText }: SavePlanProps) {
  const callId = id;

  const getHeaderContent = () => {
    switch (state) {
      case 'input-streaming':
        return (
          <>
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-spin" />
            <span className="text-sm">Planning...</span>
          </>
        );
      case 'input-available':
      case 'output-available':
        return (
          <>
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Created plan</span>
          </>
        );
      case 'output-error':
        return (
          <>
            <Bot className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">Error saving plan</span>
          </>
        );
      default:
        return (
          <>
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Research Plan</span>
          </>
        );
    }
  };

  if (state === 'output-error') {
    return (
      <Card key={callId} className="max-w-full p-0 border-red-200 bg-red-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-red-600" />
            <span className="text-red-700 font-medium">Error saving plan:</span>
          </div>
          <div className="text-red-600 text-sm mt-1">{errorText || 'An unknown error occurred'}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={callId} className="p-0">
      <Accordion type="single" collapsible>
        <AccordionItem value="plan" className="border-none">
          <AccordionTrigger className="hover:no-underline px-4 py-3">
            <div className="flex items-center gap-3 w-full min-w-0">
              {getHeaderContent()}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4">
              {plan && (
                  <div className="prose prose-sm max-w-none">
                    <div className="text-card-foreground">
                      <Markdown>{plan}</Markdown>
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
