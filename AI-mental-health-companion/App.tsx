import React, { useState, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { startChat } from './services/geminiService';
import type { Message } from './types';
import { Sender } from './types';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';


const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const backToDashboard = () => {
    window.location.href = 'http://localhost:3000'; // MINDGARDEN URL
    // OR open in new tab: window.open('http://localhost:3000', '_blank');
  };

  useEffect(() => {
    const initChat = () => {
      const chatSession = startChat();
      setChat(chatSession);

      // Add the initial welcome message from the bot
      setMessages([
        {
          id: `aura-initial-${Date.now()}`,
          text: "Hello, I'm Aura, your compassionate AI companion. I'm here to listen whenever you're ready to share. How are you feeling today?",
          sender: Sender.AI,
        },
      ]);
      setIsLoading(false);
    };
    initChat();
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    if (!chat || isLoading) return;

    setIsLoading(true);
    const userMsgId = `user-${Date.now()}`;
    const newUserMessage: Message = { id: userMsgId, text: userMessage, sender: Sender.USER };
    
    // Add user message and a placeholder for AI response
    const aiMsgId = `aura-${Date.now()}`;
    setMessages((prev) => [
      ...prev, 
      newUserMessage,
      { id: aiMsgId, text: '', sender: Sender.AI } // Placeholder
    ]);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === aiMsgId ? {...msg, text: "I'm having a little trouble connecting right now. Please try again in a moment."} : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F4E9] font-[Montserrat]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#DAD8C3] shadow-sm">
        <div className="flex items-center">
          
          <h1 className="text-2xl font-[Playfair_Display] text-[#6A752D]">
            Aura-Your Mindful Companion
          </h1>
        </div>

        
      </header>

      {/* Chat Interface */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading && messages[messages.length - 1]?.sender === Sender.USER}
      />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
