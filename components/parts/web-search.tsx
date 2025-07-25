'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Globe, Link } from 'lucide-react';
import React from 'react';
import { getFaviconUrl } from '@/lib/utils';
import { SearchResult } from 'exa-js';

interface WebSearchProps {
  query?: string;
  results: SearchResult<{}>[];
  subAgentId: string;
  searchIndex: number;
}

export function WebSearch({ query, results, subAgentId, searchIndex }: WebSearchProps) {
  const renderSearchResult = (result: SearchResult<{}>, index: number) => {
    const faviconUrl = getFaviconUrl(result.url);
    
    return (
      <Card key={index} className="hover:bg-secondary/20 transition-colors p-0 mx-2">
        <CardContent className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              {faviconUrl && (
                <img 
                  src={faviconUrl} 
                  alt="favicon" 
                  className="w-4 h-4" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
              )}
              <Link 
                className="w-4 h-4 text-muted-foreground"
                style={{ display: faviconUrl ? 'none' : 'block' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-card-foreground hover:no-underline truncate flex-1"
                >
                  {result.title || 'Untitled'}
                </a>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {new URL(result.url).hostname}
                </span>
              </div>
              {result.text && (
                <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                  {result.text}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const searchKey = `${subAgentId}-search-${searchIndex}`;
  
  return (
    <Card className="p-0">
      <Accordion type="single" collapsible>
        <AccordionItem value={searchKey} className="border-none">
          <AccordionTrigger className="hover:no-underline px-4 py-3">
            <div className="flex items-center gap-3 w-full min-w-0">
              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <span className="text-sm break-words">{query || 'Unknown query'}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {results && results.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {results.length} results
                  </span>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-0">
              <div className="space-y-2">
                {results.length > 0 ? (
                  results.map((result: SearchResult<{}>, index: number) => renderSearchResult(result, index))
                ) : (
                  <div className="text-sm text-muted-foreground px-4 py-3">No results found</div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
