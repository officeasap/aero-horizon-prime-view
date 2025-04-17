
import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { Skeleton } from '@/components/ui/skeleton';

interface ASAPAgentChatWindowProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ASAPAgentChatWindow: React.FC<ASAPAgentChatWindowProps> = ({ onClose }) => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-dark border border-[#8B0000]/20 rounded-lg shadow-xl w-[350px] sm:w-[400px] max-h-[500px] flex flex-col mb-4 overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="bg-[#1A1A1A] px-4 py-3 border-b border-[#8B0000]/20 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
            <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
            <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold text-sm">ASAP Agent</h3>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-dark to-[#1A1A1A]">
        {/* Welcome message when there are no messages */}
        {messages.length === 0 && (
          <div className="flex items-start mb-4">
            <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
              <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
              <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
            </Avatar>
            <div className="bg-[#2C2C2C] rounded-lg rounded-tl-none p-3 max-w-[85%]">
              <p className="text-white text-sm">
                Hello! I'm your ASAP Agent. How can I assist you with flight tracking, schedules, or any aviation information? Whether you need help with flight status, airport details, or travel planning, I'm here to help!
              </p>
            </div>
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
                <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
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
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-60 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start">
            <Avatar className="h-8 w-8 mr-3 border border-[#8B0000]">
              <AvatarImage src="https://source.unsplash.com/random/150x150/?portrait-female" alt="ASAP Agent" />
              <AvatarFallback className="bg-[#8B0000] text-white font-semibold">AS</AvatarFallback>
            </Avatar>
            <div className="space-y-2 max-w-[85%]">
              <Skeleton className="h-4 w-32 bg-[#2C2C2C]" />
              <Skeleton className="h-4 w-48 bg-[#2C2C2C]" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#8B0000]/20 bg-[#1A1A1A]">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about flights, airports, or travel..."
            className="flex-1 bg-[#2C2C2C] text-white rounded-l-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#8B0000] placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-[#8B0000] hover:bg-[#A80000] text-white rounded-l-none rounded-r-lg px-4 py-2 h-[38px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ASAPAgentChatWindow;
