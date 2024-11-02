import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Instagram } from 'lucide-react';
import type { Message } from '../../services/communications/types';

interface MessageComposerProps {
  onSend: (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  type: Message['type'];
  recipientId: string;
  recipientName: string;
}

export default function MessageComposer({ onSend, type, recipientId, recipientName }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSending(true);
      await onSend({
        type,
        to: recipientId,
        content: content.trim(),
        ...(type === 'email' && { subject: subject.trim() }),
        status: 'pending',
      });
      setContent('');
      setSubject('');
    } finally {
      setSending(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sms':
      case 'messenger':
        return <MessageSquare className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        {getIcon()}
        <span className="ml-2 text-sm font-medium text-gray-700">
          To: {recipientName}
        </span>
      </div>

      {type === 'email' && (
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      )}

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Type your ${type} message...`}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="absolute bottom-2 right-2 p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}