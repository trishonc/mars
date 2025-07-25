'use client';

import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { Message } from './message';
import { LoadingDots } from './loading-dots';
import { MyUIMessage } from '@/ai/types';

interface MessagesProps {
  messages: MyUIMessage[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

export function Messages({ messages, status }: MessagesProps) {
  const { containerRef, scrollToBottom } = useScrollToBottom<HTMLDivElement>();

  return (
    <div ref={containerRef} className="flex flex-col flex-1 w-full items-center">
      {messages.map((message) => (
        <Message key={message.id} message={message} status={status} />
      ))}
      {/* Separate loading spinner */}
      {(status === 'submitted') && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <LoadingDots />
      )}
    </div>
  );
}
