"use client";

import React, { useState, useRef, FormEvent, useEffect } from "react";
import { useChat } from "ai/react";
import { Message } from "ai";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";

interface ChatWindowProps {
  chapterId: string;
  videoId: string;
  userId: string;
}

export const ChatWindow = ({ chapterId, videoId, userId }: ChatWindowProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    setInput,
  } = useChat({
    api: "api/chat/chapterchat",
    onError: (e) => {
      toast.error("An error occured");
      console.error(e);
    },
  });

  const emoji = "🐶";
  const titleText = "Hello, ask me questions about the chapter";
  const placeholder =
    'I\'ve got a nose for finding the right documents! Ask, "What is a document loader?"';
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (isLoading) {
      return;
    }

    setInput("");
    const userMessage: Message = {
      id: messages.length.toString(),
      content: input,
      role: "user",
    };
    const messagesWithUserReply: Message[] = [...messages, userMessage];
    setMessages(messagesWithUserReply);

    const response = await fetch("/api/chat/chapterchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesWithUserReply,
        chapterId,
        videoId,
        userId,
      }),
    });

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      const assistantMessage: Message = {
        id: messagesWithUserReply.length.toString(),
        content: "",
        role: "assistant",
      };
      let currentMessages = [...messagesWithUserReply, assistantMessage];
      setMessages(currentMessages);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        currentMessages = currentMessages.map((msg, index) =>
          index === currentMessages.length - 1
            ? { ...msg, content: accumulatedContent }
            : msg
        );
        setMessages(currentMessages);
      }
    } else {
      toast.error("Failed to get a response from the server");
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        className="fixed bottom-4 right-4 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle />
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-sky-600 text-white p-3 text-center">
            {emoji} {titleText}
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            ref={messageContainerRef}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text xs">
                Welcome! How can I help you today?
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      m.role === "user"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-300">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="flex-1 p-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder={placeholder}
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white p-[6px] rounded-r-md transition-colors duration-200"
              >
                {isLoading ? (
                  "..."
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
