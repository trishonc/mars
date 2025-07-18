import { Card, CardContent } from '@/components/ui/card';
import { LoadingDots } from '../loading-dots';
import { Bot } from 'lucide-react';

interface ReadPlanProps {
  id: string;
  state: string;
  plan?: string;   
  output?: string;
  errorText?: string;
}

export function ReadPlan({ id, state, plan, output, errorText }: ReadPlanProps) {
  const callId = id;

  switch (state) {
    case 'input-streaming':
      return (
        <Card key={callId} className="max-w-full p-0">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <span className="text-primary font-medium">Retrieving research plan...</span>
              <LoadingDots />
            </div>
          </CardContent>
        </Card>
      );

    case 'output-available':
      return (
        <Card key={callId} className="max-w-full p-0">
          <CardContent className="py-4">
            <div className="text-sm text-primary">
              <div><strong>Retrieved Plan:</strong></div>
              {output ? (
                <div className="mt-2 text-xs text-muted-foreground max-h-32 overflow-y-auto whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="mt-2 text-xs text-muted-foreground italic">No plan found</div>
              )}
              <div className="mt-1 text-xs text-green-600">✓ {output || 'Retrieved'}</div>
            </div>
          </CardContent>
        </Card>
      );

    case 'output-error':
      return (
        <Card key={callId} className="max-w-full p-0 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-red-600" />
              <span className="text-red-700 font-medium">Error retrieving plan:</span>
            </div>
            <div className="text-red-600 text-sm mt-1">{errorText || 'An unknown error occurred'}</div>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}
