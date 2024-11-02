import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { AccountProvider } from './contexts/AccountContext';
import { Toaster } from './components/ui/toaster';
import App from './App';
import './index.css';
import './lib/firebase';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

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