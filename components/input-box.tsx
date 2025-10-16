'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Square } from 'lucide-react';

interface InputBoxProps {
  input: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  onStop: () => void;
}

export function InputBox({ input, handleSubmit, onChange, inputRef, status, onStop }: InputBoxProps) {
  const isProcessing = status === 'submitted' || status === 'streaming';

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) {
      onStop();
    } else {
      // Trigger form submit for sending message
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col items-center w-full">
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter research query"
        className="flex-1 h-full max-h-32 py-3 pr-10 text-base border-border bg-secondary/50 text-foreground focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
        disabled={isProcessing}
      />
      <Button
        type={isProcessing ? "button" : "submit"}
        size='icon'
        onClick={isProcessing ? handleButtonClick : undefined}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 hover:bg-muted"
        variant='ghost'
        aria-label={isProcessing ? "Stop generation" : "Send message"}
      >
        {isProcessing ? (
          <Square className="size-4" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </form>
  );
}