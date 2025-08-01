import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MemoizedMarkdown } from '../markdown';
import { Bot, Clock, FileText } from 'lucide-react';

interface SavePlanProps {
  id: string;
  state: string;
  plan?: string;   
  errorText?: string;
}

export function CreatePlan({ id, state, plan, errorText }: SavePlanProps) {
  const getHeaderContent = () => {
    switch (state) {
      case 'input-streaming':
        return (
          <>
            <Clock className="size-4 text-muted-foreground flex-shrink-0 animate-spin" />
            <span className="text-sm">Planning...</span>
          </>
        );
      case 'input-available':
        return (
          <>
            <FileText className="size-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Research Plan</span>
          </>
        );
      case 'output-available':
        return (
          <>
            <FileText className="size-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Research Plan</span>
          </>
        );
      case 'output-error':
        return (
          <>
            <Bot className="size-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">Error saving plan</span>
          </>
        );
      default:
        return (
          <>
            <FileText className="size-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">Research Plan</span>
          </>
        );
    }
  };

  if (state === 'output-error') {
    return (
        <Card className="p-0 w-full border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-red-600" />
              <span className="text-red-700 font-medium">Error saving plan:</span>
            </div>
            <div className="text-red-600 text-sm mt-1">{errorText || 'An unknown error occurred'}</div>
          </CardContent>
        </Card>
    );
  }

  return (
      <Card className="p-0 w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="plan" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-3 w-full min-w-0">
                {getHeaderContent()}
              </div>
            </AccordionTrigger>
            {plan && (
              <AccordionContent>
                <div className="px-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-card-foreground">
                      <MemoizedMarkdown id={id} content={plan} />
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
