import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { AccountProvider } from './contexts/AccountContext';
import { Toaster } from './components/ui/toaster';
import App from './App';
import './index.css';
import './lib/firebase';
import { getWebContainer } from './lib/webcontainer';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">Starting Development Server</h2>
        <p className="mt-3 text-sm text-gray-600">
          {message || 'Please wait while we set up your environment...'}
        </p>
      </div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-3">Initialization Error</h1>
        <p className="text-sm text-gray-600 mb-6">{error.message}</p>
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Show initial loading screen
root.render(<LoadingScreen />);

async function initializeApp(retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;
  
  try {
    // Update loading message
    root.render(<LoadingScreen message="Initializing WebContainer..." />);
    
    // Initialize WebContainer
    await getWebContainer();
    
    // Render the main app
    root.render(
      <StrictMode>
        <AuthProvider>
          <AccountProvider>
            <App />
            <Toaster />
          </AccountProvider>
        </AuthProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error(`Initialization attempt ${retryCount + 1} failed:`, error);
    
    if (retryCount < MAX_RETRIES) {
      root.render(
        <LoadingScreen message={`Retrying initialization (${retryCount + 1}/${MAX_RETRIES})...`} />
      );
      setTimeout(() => initializeApp(retryCount + 1), RETRY_DELAY);
    } else {
      root.render(
        <ErrorScreen 
          error={error instanceof Error ? error : new Error('Failed to initialize application')} 
          onRetry={() => initializeApp(0)}
        />
      );
    }
  }
}

// Start initialization
initializeApp();