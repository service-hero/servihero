import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, Star } from 'lucide-react';

interface MessageTemplatesProps {
  onSelect: (template: string) => void;
}

const TEMPLATES = [
  {
    id: '1',
    category: 'Greetings',
    templates: [
      'Hi! How can I help you today?',
      'Good morning! What can I do for you?',
      'Hello! Thanks for reaching out.'
    ]
  },
  {
    id: '2',
    category: 'Follow-ups',
    templates: [
      'Just following up on our previous conversation.',
      'I wanted to check if you had any questions.',
      'Have you had a chance to review our proposal?'
    ]
  },
  {
    id: '3',
    category: 'Closing',
    templates: [
      'Thank you for your time. Let me know if you need anything else.',
      'I appreciate your business. Have a great day!',
      'Please don\'t hesitate to reach out if you have any questions.'
    ]
  }
];

export default function MessageTemplates({ onSelect }: MessageTemplatesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium text-gray-900">Quick Responses</h3>
      </div>

      <div className="space-y-4">
        {TEMPLATES.map((category) => (
          <div key={category.id}>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              {category.category}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {category.templates.map((template, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(template)}
                  className="text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  {template}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Recently Used
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-1" />
          Favorites
        </div>
      </div>
    </div>
  );
}