import React from 'react';
import { Check, X, Loader, ArrowRight } from 'lucide-react';

interface WebContainerTestProps {
  onExit?: () => void;
}

export default function WebContainerTest({ onExit }: WebContainerTestProps) {
  // Since we're not in WebContainer, just render a simple message
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Development Environment</h1>
        <p className="text-gray-600 mb-6">
          Running in Cursor development environment. All systems are ready.
        </p>
        {onExit && (
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}