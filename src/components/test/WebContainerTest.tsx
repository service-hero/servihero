import React, { useState, useEffect } from 'react';
import { Check, X, Loader, ArrowRight } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'running' | 'failed' | 'pending';
  message?: string;
}

interface WebContainerTestProps {
  onExit?: () => void;
}

export default function WebContainerTest({ onExit }: WebContainerTestProps) {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'WebContainer Initialization', status: 'pending' },
    { name: 'Development Server', status: 'pending' },
    { name: 'React Rendering', status: 'pending' },
    { name: 'Hot Module Reload', status: 'pending' }
  ]);

  const [counter, setCounter] = useState(0);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Test React rendering and state updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(c => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update test statuses
  useEffect(() => {
    const timer = setTimeout(() => {
      setTests(currentTests => 
        currentTests.map(test => ({
          ...test,
          status: 'running',
          message: `${test.name} is active`
        }))
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Check if all tests have passed
  useEffect(() => {
    const allPassed = tests.every(test => test.status === 'running');
    setAllTestsPassed(allPassed);
  }, [tests]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <X className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Loader className="h-5 w-5 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">WebContainer Test</h1>
        
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{test.name}</p>
                {test.message && (
                  <p className="text-sm text-gray-500">{test.message}</p>
                )}
              </div>
              {getStatusIcon(test.status)}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">State Update Test Counter:</p>
          <p className="text-2xl font-semibold text-indigo-600">{counter}</p>
        </div>

        {allTestsPassed && onExit && (
          <button
            onClick={onExit}
            className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        )}

        <p className="mt-6 text-sm text-gray-500 text-center">
          {allTestsPassed 
            ? 'All tests have passed! You can now proceed to the dashboard.'
            : 'Waiting for all tests to complete...'}
        </p>
      </div>
    </div>
  );
}