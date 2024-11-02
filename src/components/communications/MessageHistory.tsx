import React from 'react';
import { format } from 'date-fns';
import { Mail, MessageSquare, Instagram, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Message } from '../../services/communications/types';

interface MessageHistoryProps {
  messages: Message[];
}

export default function MessageHistory({ messages }: MessageHistoryProps) {
  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sms':
      case 'messenger':
        return <MessageSquare className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {getIcon(message.type)}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              {getStatusIcon(message.status)}
              <span className="ml-1 text-sm text-gray-500">
                {format(message.createdAt, 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          </div>

          {message.subject && (
            <p className="text-sm font-medium text-gray-900 mb-1">
              {message.subject}
            </p>
          )}

          <p className="text-sm text-gray-600">{message.content}</p>

          {message.error && (
            <p className="mt-2 text-sm text-red-600">
              Error: {message.error}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}