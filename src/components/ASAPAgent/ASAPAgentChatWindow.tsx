import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { v4 as uuidv4 } from 'uuid';

import { useMediaQuery } from '@/hooks/use-media-query';

const API_KEY = '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';

interface ASAPAgentChatWindowProps {
  onClose: () => void;
  isMobile?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ASAPAgentChatWindow: React.FC<ASAPAgentChatWindowProps> = ({ onClose, isMobile = false }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('asap_agent_messages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const systemMessage: Message = {
    id: 'system-1',
    role: 'system',
    content: `You are ASAP Agent, a beautiful, friendly, and intelligent assistant for the aviation site 'ASAP Tracker'. 
Your primary role is to help with:
- Flight tracking and schedules
- Airport and airline information
- Weather updates for travelers
- Trip planning assistance
- General aviation knowledge
- Travel tips

Respond in a friendly, professional manner. You're knowledgeable about aviation topics, airports (especially in Indonesia), 
and can provide helpful information about the site's features. For any inquiries outside your knowledge, politely suggest
using the site's dedicated features or contacting support.

Keep responses concise but informative. If asked about specific flights, mention that users can use the Live Tracker or
Flight Status pages for real-time information.

IMPORTANT: Always provide accurate information but keep responses friendly and conversational.`,
    timestamp: new Date()
  };
  
  useEffect(() => {
    localStorage.setItem('asap_agent_messages', JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "Hello! I'm your ASAP Agent. How can I assist you with flight tracking, schedules, or any aviation information?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetchChatResponse(messageContent, messages);
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      setMessages([]);
      localStorage.removeItem('asap_agent_messages');
    }
  };

  return (
    <div 
      className={`bg-dark border border-[#8B0000]/20 rounded-lg shadow-xl flex flex-col mb-4 overflow-hidden animate-scale-in transition-all ${
        isMobile ? 'fixed inset-0 z-50' : 'w-[350px] sm:w-[400px] max-h-[500px]'
      }`}
    >
      <div className="bg-[#1A1A1A] px-4 py-3 border-b border-[#8B0000]/20 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
            <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="ASAP Agent" />
            <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold text-sm">ASAP Agent</h3>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-gray-400 hover:text-white p-1 h-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-dark to-[#1A1A1A]">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
                <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="ASAP Agent" />
                <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`rounded-lg p-3 max-w-[85%] ${
                message.role === 'user' 
                  ? 'bg-[#8B0000] text-white rounded-br-none ml-auto' 
                  : 'bg-[#2C2C2C] text-white rounded-tl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
              <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="ASAP Agent" />
              <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
            </Avatar>
            <div className="space-y-2 max-w-[85%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#8B0000]/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#8B0000]/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#8B0000]/60 animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[#8B0000]/20 bg-[#1A1A1A]">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about flights, airports, or travel..."
            className="flex-1 bg-[#2C2C2C] text-white rounded-lg px-4 py-2 mx-2 outline-none focus:ring-1 focus:ring-[#8B0000] placeholder:text-gray-400"
            disabled={isLoading}
            ref={inputRef}
            aria-label="Chat message"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-[#8B0000] hover:bg-[#A80000] text-white rounded-lg p-2 h-[38px] w-[38px] flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ASAPAgentChatWindow;
