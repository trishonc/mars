'use client';

import { MemoizedMarkdown } from '../markdown';
import { Card, CardContent } from '@/components/ui/card';

interface TextProps {
  id: string;
  content: string;
}

export function Text({ id, content }: TextProps) {
  return (
      <Card className="p-0 w-fit">
        <CardContent className="px-4 py-3">
          <MemoizedMarkdown id={id} content={content} />
        </CardContent>
      </Card>
  );
}