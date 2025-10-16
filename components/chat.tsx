'use client';

import { useChat } from '@ai-sdk/react';
import { InputBox } from './input-box';
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from 'ai';
import { Messages } from './messages';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { MyUIMessage } from '@/ai/types';
import { Button } from '@/components/ui/button';
import { RotateCcw, Square } from 'lucide-react';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, setMessages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  const isProcessing = status === 'submitted' || status === 'streaming';

  // When no messages, show centered layout
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
          <div className="text-foreground text-4xl text-center">
            What would you like to research?
          </div>
          <InputBox
            input={input}
            handleSubmit={handleSubmit}
            onChange={setInput}
            inputRef={inputRef}
            status={status}
            onStop={stop}
          />
        </div>
      </div>
    );
  }

  // When messages exist, show normal layout
  return (
    <>
      {/* Messages area - will take flex-1 in parent */}
      <StickToBottom 
        className="flex-1 w-full min-h-0 relative"
        resize="smooth"
        initial="smooth"
      >
        <StickToBottom.Content className="flex flex-col items-center px-4">
          <Messages messages={messages} status={status} />
        </StickToBottom.Content>
        
        <ScrollToBottomButton />
      </StickToBottom>
      
      {/* Action buttons - fixed at bottom */}
      <div className="flex-shrink-0 flex justify-center w-full pb-6 bg-background">
        <div className="flex gap-3">
          {isProcessing ? (
            <Button
              onClick={stop}
              variant="outline"
              size="lg"
              className="min-w-32"
            >
              <Square className="mr-2 size-4" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="default"
              size="lg"
              className="min-w-32"
            >
              <RotateCcw className="mr-2 size-4" />
              Start Over
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function ScrollToBottomButton() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;

  return (
    <Button
      onClick={() => scrollToBottom()}
      size="icon"
      className="sticky bottom-18 left-1/2 -translate-x-1/2 z-10 rounded-full shadow-lg"
      aria-label="Scroll to bottom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6 6-6-6" />
      </svg>
    </Button>
  );
} 