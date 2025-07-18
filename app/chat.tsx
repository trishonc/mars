'use client';

import { useChat } from '@ai-sdk/react';
import { InputBox } from '../components/input-box';
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from 'ai';
import { Messages } from '../components/messages';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat({
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
      <ScrollArea className="flex-1 flex flex-col items-center w-full min-h-0 overflow-y-auto px-4">
        <Messages messages={messages} status={status} />
      </ScrollArea>
      
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