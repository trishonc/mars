'use client';

import { Message } from './message';
import { LoadingDots } from './loading-dots';
import { MyUIMessage } from '@/ai/types';

interface MessagesProps {
  messages: MyUIMessage[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

export function Messages({ messages, status }: MessagesProps) {

  return (
    <div className="flex flex-col flex-1 w-full items-center">
      {messages.map((message) => (
        <Message key={message.id} message={message} status={status} />
      ))}
      {/* Separate loading spinner */}
      {(status === 'submitted') && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <LoadingDots />
      )}
      {/* Invisible element at the bottom for scroll target */}
      <div />
    </div>
  );
}
