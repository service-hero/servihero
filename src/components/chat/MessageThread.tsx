import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,
  Paperclip,
  Mic,
  Smile,
  Sparkles,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import MessageTemplates from './MessageTemplates';
import AIAssistant from './AIAssistant';
import EmojiPicker from './EmojiPicker';
import type { ChatMessage, ChatParticipant } from '../../types/chat';

interface MessageThreadProps {
  participant: ChatParticipant;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onSendFile?: (file: File) => void;
}

export default function MessageThread({ 
  participant, 
  messages, 
  onSendMessage,
  onSendFile 
}: MessageThreadProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onSendFile) return;
    onSendFile(file);
  };

  const getMessageStatus = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}`}
              alt={participant.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              participant.status === 'online' ? 'bg-green-500' :
              participant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{participant.name}</h2>
            <p className="text-sm text-gray-500">
              {participant.status === 'online' ? 'Online' : 
               participant.lastSeen ? `Last seen ${format(participant.lastSeen, 'p')}` : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[70%] ${
                  msg.senderId === 'current-user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {msg.senderId !== 'current-user' && index === 0 && (
                    <img
                      src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}`}
                      alt={participant.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  
                  <div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      msg.senderId === 'current-user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.type === 'text' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : msg.type === 'image' ? (
                        <img
                          src={msg.metadata?.imageUrl}
                          alt="Shared image"
                          className="rounded-lg max-w-sm"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{msg.metadata?.fileName}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.timestamp), 'p')}
                      </span>
                      {msg.senderId === 'current-user' && getMessageStatus(msg.status)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-6 py-4 border-t">
        {showTemplates && (
          <div className="mb-4">
            <MessageTemplates onSelect={(template) => {
              setMessage(template);
              setShowTemplates(false);
            }} />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-10"
              rows={1}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <EmojiPicker onSelect={(emoji) => setMessage(prev => prev + emoji)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <Button
            variant={isRecording ? 'destructive' : 'ghost'}
            size="icon"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}