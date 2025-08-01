'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import React from 'react';
import { getFaviconUrl } from '@/lib/utils';

interface WebFetchProps {
  url: string;
  title?: string;
}

export function WebFetch({ url, title }: WebFetchProps) {
  const faviconUrl = getFaviconUrl(url);
  const hostname = new URL(url).hostname;
  
  return (
    <Card className="hover:bg-secondary/20 transition-colors p-0">
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Eye className="size-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-12">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm hover:no-underline truncate flex-1"
              >
                Read <span className="text-muted-foreground">{title || hostname}</span>
              </a>
              <div className="flex items-center gap-2 flex-shrink-0">
              {faviconUrl && (
                  <img 
                    src={faviconUrl} 
                    alt="favicon" 
                    className="size-4" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span className="text-xs text-muted-foreground">
                  {hostname}
                </span>
                
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
