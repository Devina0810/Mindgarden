import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-[#F8F4E9] px-6 py-4 border-t border-[#D1D1B0] font-[Montserrat]">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-full border border-[#D1D1B0] bg-[#F5F5DC] text-[#3A3A3A] placeholder:text-[#999] focus:ring-[#6A752D] focus:border-[#6A752D] transition duration-300 disabled:opacity-50"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 flex items-center justify-center bg-[#6A752D] text-white rounded-full hover:bg-[#5A6425] transition duration-300 disabled:bg-[#B6B6A0] disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
