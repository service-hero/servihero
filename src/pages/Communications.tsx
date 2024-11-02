import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import MessageComposer from '../components/communications/MessageComposer';
import MessageHistory from '../components/communications/MessageHistory';
import { Mail, MessageSquare, Instagram } from 'lucide-react';
import type { Message } from '../services/communications/types';

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'email',
    from: 'support@agency.com',
    to: 'client@example.com',
    subject: 'Project Update',
    content: 'Here is the latest update on your project...',
    status: 'sent',
    sentAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    type: 'sms',
    from: '+1234567890',
    to: '+0987654321',
    content: 'Your appointment is confirmed for tomorrow at 2 PM',
    status: 'sent',
    sentAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Communications() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [activeTab, setActiveTab] = useState<Message['type']>('email');

  const handleSendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In a real app, this would use the CommunicationService
    const newMessage: Message = {
      id: Date.now().toString(),
      ...message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages([newMessage, ...messages]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Communications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all your communications in one place
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Message['type'])}>
        <TabsList>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="messenger" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messenger
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center">
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <MessageComposer
            type={activeTab}
            onSend={handleSendMessage}
            recipientId="client@example.com"
            recipientName="John Doe"
          />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Message History</h2>
          <MessageHistory
            messages={messages.filter((m) => m.type === activeTab)}
          />
        </div>
      </Tabs>
    </div>
  );
}