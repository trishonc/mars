'use client';

import { useChat } from '@ai-sdk/react';
import { InputBox } from './input-box';
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from 'ai';
import { Messages } from './messages';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { MyUIMessage } from '@/ai/types';
import { Button } from '@/components/ui/button';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat<MyUIMessage>({
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

  // When no messages, show centered layout
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
          <div className="text-foreground text-4xl text-center">
            How may I help you?
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
      
      {/* Input area - fixed height at bottom */}
      <div className="flex-shrink-0 flex justify-center w-full pb-4 bg-background">
        <div className="w-full max-w-3xl px-2">
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