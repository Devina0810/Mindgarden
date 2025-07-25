import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const AICompanion = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    setMessages([{
      text: "Hello! I'm your AI Mental Health Companion 🌱. I'm here to listen, support, and help you navigate your mental wellness journey. How are you feeling today?",
      sender: "ai",
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateResponse(input);
      const aiMessage = {
        text: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Mental health specific responses
    if (input.includes('anxious') || input.includes('anxiety') || input.includes('worried')) {
      const responses = [
        "I hear that you're feeling anxious. That's completely valid. Try taking three deep breaths with me - in for 4, hold for 4, out for 4. What's making you feel anxious right now?",
        "Anxiety can feel overwhelming, but remember you're not alone. Let's practice grounding - name 5 things you can see, 4 you can touch, 3 you can hear. What helps you feel more centered?",
        "Thank you for sharing that you're feeling anxious. It takes courage to acknowledge these feelings. Would you like to talk about what's triggering this anxiety?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('sad') || input.includes('down') || input.includes('depressed')) {
      const responses = [
        "I'm sorry you're feeling this way. Your feelings are valid and it's okay to not be okay sometimes. What's been weighing on your heart lately?",
        "Sadness is a natural human emotion, and it's important to honor it. You're being brave by reaching out. What would help you feel a little lighter today?",
        "I hear you, and I want you to know that this feeling won't last forever. You matter, and your feelings matter. What has helped you through difficult times before?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('stress') || input.includes('overwhelmed') || input.includes('pressure')) {
      const responses = [
        "Stress can feel like carrying the world on your shoulders. Let's break things down together - what's the most pressing thing on your mind right now?",
        "When we're overwhelmed, everything can feel urgent. Remember, you can only do one thing at a time. What's one small step you could take today?",
        "I understand you're feeling stressed. Your mind and body are telling you something important. What would help you feel more balanced right now?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('happy') || input.includes('good') || input.includes('great')) {
      const responses = [
        "I'm so glad to hear you're feeling good! It's wonderful to celebrate these positive moments. What's bringing you joy today?",
        "That's beautiful to hear! Happiness is precious - what would you like to do to nurture this feeling?",
        "Your positive energy is wonderful! Sometimes sharing our joy can multiply it. What's been going well for you?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default supportive responses
    const defaultResponses = [
      "Thank you for sharing with me. I'm here to listen and support you. Tell me more about what you're experiencing.",
      "Your feelings and experiences matter. I'm honored that you're opening up to me. How can I best support you right now?",
      "I appreciate your trust in sharing with me. Every feeling you have is valid. What would be most helpful for you in this moment?",
      "I'm here with you in this journey. Your mental health matters, and so do you. What's on your mind today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "I'm feeling anxious today 😰",
    "I need someone to talk to 💭",
    "I'm stressed about work 😓",
    "I'm feeling lonely 😔",
    "I want to practice gratitude 🙏",
    "I need motivation 💪"
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F8F4E9] via-[#F0EAD6] to-[#E8E2D5] text-[#3A3A3A] font-[Montserrat]">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-[Playfair_Display] text-[#6A752D] mb-2">
              🤖 AI Mental Health Companion
            </h1>
            <p className="text-[#6B6B4D] text-sm">
              A safe space for your thoughts, feelings, and mental wellness journey
            </p>
          </motion.div>

          {/* Chat Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6"
          >
            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-[#6A752D] scrollbar-track-[#F5F5DC]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#6A752D] text-white rounded-br-md'
                      : 'bg-[#F5F5DC] text-[#3A3A3A] rounded-bl-md border border-[#DDE1C5]'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#F5F5DC] px-4 py-3 rounded-2xl rounded-bl-md border border-[#DDE1C5]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#6A752D] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#6A752D] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#6A752D] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="mb-4">
              <p className="text-xs text-[#6B6B4D] mb-2">Quick conversation starters:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="px-3 py-1 bg-[#F5F5DC] text-[#6A752D] text-xs rounded-full border border-[#DDE1C5] hover:bg-[#6A752D] hover:text-white transition-all duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to listen."
                className="flex-1 p-3 border border-[#DDE1C5] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#6A752D] focus:border-transparent bg-[#FAFAF8] text-sm"
                rows="2"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  input.trim() && !isTyping
                    ? 'bg-[#6A752D] text-white hover:bg-[#5A6425] transform hover:scale-105'
                    : 'bg-[#D1D1B0] text-[#999] cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          </motion.div>

          {/* Mental Health Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-[#DDE1C5]"
          >
            <h3 className="text-sm font-semibold text-[#6A752D] mb-2">🆘 Crisis Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="font-medium">Suicide Prevention Lifeline</p>
                <p className="text-[#6B6B4D]">Call or Text: 988</p>
              </div>
              <div>
                <p className="font-medium">Crisis Text Line</p>
                <p className="text-[#6B6B4D]">Text HOME to 741741</p>
              </div>
              <div>
                <p className="font-medium">Emergency</p>
                <p className="text-[#6B6B4D]">Call: 911</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AICompanion;