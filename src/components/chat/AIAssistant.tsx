import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Wand2 } from 'lucide-react';

interface AIAssistantProps {
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

const SUGGESTIONS = [
  {
    type: 'response',
    content: 'I understand your concern. Let me help you with that.',
  },
  {
    type: 'followup',
    content: 'Would you like me to schedule a follow-up call to discuss this further?',
  },
  {
    type: 'clarification',
    content: 'Could you please provide more details about your specific requirements?',
  },
];

export default function AIAssistant({ onSelect, onClose }: AIAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-80 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-purple-500" />
        <h3 className="font-medium text-gray-900">AI Assistant</h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {SUGGESTIONS.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                onSelect(suggestion.content);
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 transition-colors"
            >
              {suggestion.content}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
      >
        <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Generating...' : 'Generate More'}
      </button>
    </div>
  );
}