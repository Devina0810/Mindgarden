import React, { useEffect, useRef } from 'react';
import { Message, Sender } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { BotIcon } from './Icons';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto smooth-scroll bg-[#F8F4E9] font-[Montserrat]">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex items-end justify-start p-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5E5C9] flex items-center justify-center shadow-md">
              <BotIcon className="w-5 h-5 text-[#6A752D]" />
            </div>
            <div className="px-4 py-3 rounded-2xl shadow bg-[#F5F5DC]">
              <TypingIndicator />
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
};

export default ChatWindow;
