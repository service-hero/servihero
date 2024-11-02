import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import { format } from 'date-fns';
import type { ChatMessage, ChatParticipant } from '../../types/chat';

interface ChatWindowProps {
  participant: ChatParticipant;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onSendFile?: (file: File) => void;
}

export default function ChatWindow({ participant, messages, onSendMessage, onSendFile }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendFile) {
      onSendFile(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b">
        <div className="relative">
          <img
            src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}`}
            alt={participant.name}
            className="w-10 h-10 rounded-full"
          />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            participant.status === 'online' ? 'bg-green-400' :
            participant.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
          }`} />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{participant.name}</p>
          <p className="text-xs text-gray-500">
            {participant.status === 'online' ? 'Online' :
             participant.status === 'away' ? 'Away' :
             participant.lastSeen ? `Last seen ${format(participant.lastSeen, 'PP')}` : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === participant.id ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[70%] ${
              msg.senderId === participant.id
                ? 'bg-gray-100 rounded-br-lg'
                : 'bg-indigo-600 text-white rounded-bl-lg'
            } rounded-t-lg px-4 py-2`}>
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.senderId === participant.id ? 'text-gray-500' : 'text-indigo-100'
              }`}>
                {format(msg.timestamp, 'p')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Image className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Smile className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </form>
    </div>
  );
}