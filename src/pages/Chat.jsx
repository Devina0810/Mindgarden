import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { db, auth } from "../utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperPlane, FaLeaf } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { text: "I feel anxious 😰", tags: ["anxiety"] },
    { text: "I need motivation 💪", tags: ["motivation"] },
    { text: "I'm feeling depressed 😞", tags: ["depression"] },
    { text: "Help me relax 🧘", tags: ["relaxation"] },
    { text: "I'm having a panic attack 😫", tags: ["emergency", "panic"] },
  ];

  const crisisResources = [
    { name: "Suicide Prevention Lifeline", phone: "988", url: "https://988lifeline.org" },
    { name: "Crisis Text Line", text: "HOME to 741741", url: "https://www.crisistextline.org" },
    { name: "Trevor Project (LGBTQ+)", phone: "1-866-488-7386", url: "https://www.thetrevorproject.org" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        text: "Hi there! I'm MindGarden AI 🌱. I'm here to listen and help with mental wellness. How are you feeling today?",
        sender: "bot",
        timestamp: new Date()
      }]);
    }
    scrollToBottom();
  }, [messages]);

  const detectEmergency = (text) => {
    const emergencyPhrases = [
      "kill myself", "end my life", "want to die",
      "suicide", "self harm", "hurting myself"
    ];
    return emergencyPhrases.some(phrase => text.toLowerCase().includes(phrase));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const user = auth.currentUser;
    const userMsg = { text: input, sender: "user", timestamp: new Date() };

    if (detectEmergency(input)) {
      setEmergencyMode(true);
      const crisisMsg = {
        text: "I want you to know you're not alone. Here are immediate resources that can help:",
        sender: "bot",
        timestamp: new Date(),
        isEmergency: true
      };
      setMessages(prev => [...prev, userMsg, crisisMsg]);
      setInput("");
      return;
    }

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Try Replit backend first, fallback to local responses
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://b5e40920-0e5d-4cf8-8f34-a258952ca10c-00-1ajsvef5h36q8.pike.replit.dev/chat";
      
      console.log("Attempting to connect to:", backendUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      let replyText = data.response;
      
      if (!replyText) {
        throw new Error("Empty response");
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const botMsg = { text: replyText, sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);

      if (saveEnabled && user) {
        try {
          await addDoc(collection(db, "conversations"), {
            uid: user.uid,
            userMessage: userMsg.text,
            botReply: botMsg.text,
            createdAt: serverTimestamp(),
            tags: quickPrompts.find(p => currentInput.includes(p.text))?.tags || []
          });
        } catch (e) {
          console.warn("Failed to save conversation:", e);
        }
      }
    } catch (err) {
      console.error("Backend failed, using local responses:", err);
      
      // Fallback to local intelligent responses
      const responses = {
        anxiety: [
          "I understand you're feeling anxious. That's completely valid. Try taking slow, deep breaths - in for 4 counts, hold for 4, out for 4. 🌱",
          "Anxiety can feel overwhelming, but remember it's temporary. You've gotten through difficult times before. 💚",
          "When anxiety hits, try grounding yourself: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste."
        ],
        sad: [
          "I hear that you're feeling sad. It's okay to feel this way - your emotions are valid. 🤗",
          "Sadness is natural. Be gentle with yourself today. What's one small thing that usually brings you comfort?",
          "I'm here to listen. Feelings come and go like waves. You don't have to carry this alone."
        ],
        depression: [
          "Thank you for sharing. Depression can make everything harder, but reaching out shows incredible strength. 🌟",
          "Depression can make simple tasks overwhelming. Remember to celebrate small victories - even getting through today counts.",
          "You deserve support. Depression is treatable. Have you been able to connect with any mental health resources?"
        ],
        motivation: [
          "Everyone needs motivation sometimes! What's one small step you could take today? 💪",
          "Motivation often comes after action. What's the tiniest thing you could do right now?",
          "Remember why you started. Your goals matter, and so do you. Progress isn't always linear. 🌱"
        ],
        relax: [
          "Let's focus on relaxation. Try this: breathe in for 4, hold for 4, exhale for 6. Repeat. 🧘‍♀️",
          "Relaxation is a skill. Try progressive muscle relaxation - tense and release each muscle group.",
          "Create peace: dim lights, play calming music, or step outside. What sounds appealing right now?"
        ],
        default: [
          "I'm here to listen and support you. Could you tell me more about what's on your mind? 💚",
          "Thank you for sharing. Your feelings matter. What would be most helpful right now?",
          "Sometimes talking helps provide relief. How are you taking care of yourself today?",
          "You have a lot on your mind. What feels most important to address right now?"
        ]
      };

      let responseCategory = 'default';
      const lowerInput = currentInput.toLowerCase();
      
      if (lowerInput.includes('anxious') || lowerInput.includes('anxiety') || lowerInput.includes('worry')) {
        responseCategory = 'anxiety';
      } else if (lowerInput.includes('sad') || lowerInput.includes('down') || lowerInput.includes('crying')) {
        responseCategory = 'sad';
      } else if (lowerInput.includes('depress') || lowerInput.includes('hopeless') || lowerInput.includes('empty')) {
        responseCategory = 'depression';
      } else if (lowerInput.includes('motivat') || lowerInput.includes('energy') || lowerInput.includes('lazy')) {
        responseCategory = 'motivation';
      } else if (lowerInput.includes('relax') || lowerInput.includes('calm') || lowerInput.includes('stress')) {
        responseCategory = 'relax';
      }

      const categoryResponses = responses[responseCategory];
      const replyText = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      const botMsg = { text: replyText, sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);

      if (saveEnabled && user) {
        try {
          await addDoc(collection(db, "conversations"), {
            uid: user.uid,
            userMessage: userMsg.text,
            botReply: botMsg.text,
            createdAt: serverTimestamp(),
            tags: quickPrompts.find(p => currentInput.includes(p.text))?.tags || []
          });
        } catch (e) {
          console.warn("Failed to save conversation:", e);
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    setTimeout(() => document.querySelector("textarea")?.focus(), 50);
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-b from-[#F8F4E9] to-[#F0EAD6] text-[#3A3A3A] font-sans px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaLeaf className="text-3xl text-[#6A752D]" />
            <h1 className="text-3xl text-[#6A752D] font-serif text-center">
              MindGarden AI
            </h1>
          </div>
          <p className="text-sm text-center text-[#6B6B4D] mb-4">
            A safe space to nurture your mental wellbeing
          </p>

          <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <BsLightningCharge className="text-[#6A752D] mr-2" />
              <span className="text-sm">Quick Responses</span>
            </div>
            <label className="flex items-center cursor-pointer">
              <span className="text-sm text-[#555] mr-2">Save chats</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={saveEnabled}
                  onChange={() => setSaveEnabled(prev => !prev)}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${saveEnabled ? 'bg-[#6A752D]' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${saveEnabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 h-[450px] overflow-y-auto mb-4 relative">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[85%] text-sm ${
                    msg.sender === "user"
                      ? "bg-[#6A752D] text-white rounded-tr-none"
                      : "bg-[#F5F5DC] text-[#333] rounded-tl-none"
                  } shadow-sm`}
                >
                  {msg.text}
                  <div className="text-xs opacity-50 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center text-[#6B6B4D] text-sm italic">
                <div className="typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                MindGarden is thinking...
              </div>
            )}

            {emergencyMode && (
              <div className="bg-[#FFF8F8] border-l-4 border-[#FF6B6B] p-3 my-3 rounded">
                <h3 className="font-bold text-[#D33]">Immediate Help Available</h3>
                <ul className="mt-2 space-y-2">
                  {crisisResources.map((resource, i) => (
                    <li key={i}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6A752D] hover:underline flex items-center"
                      >
                        <span className="font-medium">{resource.name}:</span>
                        <span className="ml-1">{resource.phone || resource.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setEmergencyMode(false)}
                  className="mt-2 text-sm text-[#555] hover:text-[#333]"
                >
                  Continue chatting
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt.text)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  prompt.tags.includes("emergency")
                    ? "bg-[#FFEEEE] text-[#D33] border border-[#FFCCCC] hover:bg-[#FFE5E5]"
                    : "bg-[#F5F5DC] text-[#6B6B4D] border border-[#D1D1B0] hover:bg-[#E8E8D0]"
                }`}
              >
                {prompt.text}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                rows="2"
                placeholder="Share what's on your mind..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 rounded-lg border border-[#D1D1B0] bg-[#F5F5DC] focus:outline-[#6A752D] resize-none pr-12"
              />
              <button
                onClick={() => setInput("")}
                disabled={!input}
                className={`absolute right-2 bottom-2 p-1 rounded-full ${input ? 'text-[#6B6B4D] hover:bg-[#E8E8D0]' : 'text-[#D1D1B0]'}`}
              >
                ×
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`p-3 rounded-lg ${input.trim() ? 'bg-[#6A752D] hover:bg-[#5A6425] text-white' : 'bg-[#D1D1B0] text-[#999] cursor-not-allowed'}`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .typing-dots {
          display: flex;
          align-items: center;
          height: 17px;
          margin-right: 8px;
        }
        .typing-dots .dot {
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: #6B6B4D;
          border-radius: 50%;
          opacity: 0.4;
          animation: typing-dots 1.4s infinite ease-in-out;
        }
        .typing-dots .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-dots .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dots .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing-dots {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Chat;