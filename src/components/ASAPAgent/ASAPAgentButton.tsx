
import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ASAPAgentChatWindow from './ASAPAgentChatWindow';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useMediaQuery } from '@/hooks/use-media-query';

// Floating button that appears at the bottom right of the screen
const ASAPAgentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset unread messages when opening chat
      setUnreadMessages(0);
    }
  };

  // Add a "welcome" notification after a short delay when user first visits the site
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('asap_agent_welcome_shown');
    
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setUnreadMessages(1);
        localStorage.setItem('asap_agent_welcome_shown', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <ASAPAgentChatWindow 
          onClose={() => setIsOpen(false)}
          isMobile={isMobile}
        />
      )}
      
      {/* Floating Button */}
      <button
        onClick={toggleChatWindow}
        className="h-14 w-14 rounded-full bg-[#8B0000] shadow-lg hover:bg-[#A80000] transition-colors flex items-center justify-center text-white"
        aria-label="Chat with ASAP Agent"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-[#8B0000] text-xs flex items-center justify-center font-bold">
                {unreadMessages}
              </span>
            )}
          </div>
        )}
      </button>
      <div className="text-xs mt-2 font-medium text-white bg-gray-dark/50 px-3 py-1 rounded-lg shadow">
        ASAP Agent
      </div>
    </div>
  );
};

export default ASAPAgentButton;
