import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatBubble = ({ onOpenChat }: { onOpenChat: () => void }) => {
  return (
    <div
      className="fixed bottom-4 right-4 p-4 bg-blue-500 rounded-full cursor-pointer"
      onClick={onOpenChat}
    >
      <MessageCircle className="text-white" />
    </div>
  );
};

export default ChatBubble;