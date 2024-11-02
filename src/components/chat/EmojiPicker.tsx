import React from 'react';
import { motion } from 'framer-motion';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: ['😊', '😂', '🥰', '😎', '🤔', '😅', '😇', '🙂', '😉', '😌']
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👋', '🙌', '👏', '🤝', '✌️', '👌', '🤞', '🤟', '🤙']
  },
  {
    name: 'Objects',
    emojis: ['💼', '📱', '💻', '⌚️', '📸', '🎮', '🎧', '📚', '✏️', '📎']
  }
];

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <div className="w-64 p-4">
      <div className="space-y-4">
        {EMOJI_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {category.name}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {category.emojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}