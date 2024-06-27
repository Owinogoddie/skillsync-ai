'use client';

import React, { useState } from 'react';

interface ChatInterfaceProps {
  chapterId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chapterId }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  return (
    <>
      {/* Chat Bubble */}
      <button 
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-3 font-bold">
            Chat with AI
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Example messages */}
            <div className="text-right">
              <span className="inline-block p-2 rounded-lg bg-blue-100 text-blue-800">
                Hello, can you help me understand this chapter?
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block p-2 rounded-lg bg-gray-100 text-gray-800">
                Of course! I&apos;d be happy to help. What specific part of the chapter would you like to discuss?
              </span>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-300">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white p-[5px] rounded-r-md transition-colors duration-200"
                onClick={() => {/* Send message function will go here */}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInterface;