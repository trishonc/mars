'use client';

import { Streamdown } from 'streamdown';
import { Card, CardContent } from '@/components/ui/card';

interface TextProps {
  text: string;
}

export function Text({ text }: TextProps) {
  return (
      <Card className="p-0 w-fit">
        <CardContent className="px-4 py-3">
          <Streamdown>{text}</Streamdown>
        </CardContent>
      </Card>
  );
}