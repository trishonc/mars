"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getFaviconUrl } from "@/lib/utils";

interface CitationsCardProps {
  citationNumber: number;
  url: string;
  title: string;
}

export function CitationsCard({ citationNumber, url, title }: CitationsCardProps) {
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-4 w-auto min-w-[1.2rem] px-1 py-0 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 rounded-sm inline-flex items-center cursor-pointer mx-0.5 translate-y-[-0.1em]"
        >
          {citationNumber}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        side="top" 
        align="start" 
        className="w-80 p-3"
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2 text-foreground">
                {title}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <img
                  src={getFaviconUrl(url) || ''}
                  alt=""
                  className="size-3 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-primary hover:underline"
                >
                  {url}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}