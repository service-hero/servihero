import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from './contexts/AuthContext';
import { AccountProvider } from './contexts/AccountContext';
import { Toaster } from './components/ui/toaster';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/auth/Profile';
import AccountSettings from './pages/auth/AccountSettings';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Contacts from './pages/Contacts';
import Chat from './pages/Chat';
import Agency from './pages/Agency';
import Marketing from './pages/Marketing';
import Integrations from './pages/Integrations';
import WebContainerTest from './components/test/WebContainerTest';
import ApiTest from './components/test/ApiTest';

export default function App() {
  const { user, loading } = useAuth();
  const [showTest, setShowTest] = useState(true);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show test component in development
  if (import.meta.env.DEV && showTest) {
    return <WebContainerTest onExit={() => setShowTest(false)} />;
  }

  return (
    <BrowserRouter>
      {!user ? (
        // Public routes
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        // Protected routes wrapped in providers
        <AccountProvider>
          <DndProvider backend={HTML5Backend}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/agency" element={<Agency />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/api-test" element={<ApiTest />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          </DndProvider>
        </AccountProvider>
      )}
      <Toaster />
    </BrowserRouter>
  );
}