import React from 'react';
import { Message, Sender } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  const bubbleClasses = isUser
    ? 'bg-[#6A752D] text-white'
    : 'bg-[#F5F5DC] text-[#3A3A3A]';

  const containerClasses = isUser
    ? 'flex items-end justify-end'
    : 'flex items-end justify-start';

  const textWithBreaks = message.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const Avatar = isUser ? UserIcon : BotIcon;

  return (
    <div className={`p-2 w-full max-w-full ${containerClasses}`}>
      <div className="flex items-start gap-3 max-w-xl">
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5E5C9] flex items-center justify-center shadow-sm">
            <Avatar className="w-5 h-5 text-[#6A752D]" />
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}
          style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        >
          <p className="text-sm leading-relaxed font-[Montserrat]">{textWithBreaks}</p>
        </div>
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D6DEC3] flex items-center justify-center shadow-sm">
            <Avatar className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
