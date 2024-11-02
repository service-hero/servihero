import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  User,
  LogOut,
  Settings,
  Building2,
  CreditCard,
  Users,
  Brain,
  Sparkles,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import NotificationPanel from '../notifications/NotificationPanel';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/conversations': 'Conversations',
  '/pipelines': 'Pipeline',
  '/contacts': 'Contacts',
  '/reporting': 'Analytics & Reporting',
  '/integrations': 'Integrations',
  '/agency': 'Agency',
  '/marketing': 'Marketing',
  '/help': 'Help Center',
  '/showcase': 'Showcase',
  '/settings': 'Settings',
  '/settings/profile': 'Profile Settings',
  '/settings/billing': 'Billing & Plans'
};

const MOCK_ORGANIZATIONS = [
  { id: '1', name: 'Hero Heating And Air', isActive: true },
  { id: '2', name: 'Cool Tech Solutions' },
  { id: '3', name: 'Premium HVAC Services' }
];

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications] = useState(3);
  const [unreadMessages] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentPageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50" />
      <div className="relative w-full px-6 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Page Title with AI indicator */}
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">
              {currentPageTitle}
            </h1>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-emerald-500 rounded-full"
              title="AI Assistant Active"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* Messages */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowMessages(true)}
            >
              <MessageSquare className="h-5 w-5" />
              {unreadMessages > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {unreadMessages}
                </motion.span>
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {unreadNotifications}
                </motion.span>
              )}
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white"
                />
              </Button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    {/* User Menu Content */}
                    <div className="py-1">
                      {MOCK_ORGANIZATIONS.map((org) => (
                        <button
                          key={org.id}
                          className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2" />
                            {org.name}
                          </span>
                          {org.isActive && <Check className="w-4 h-4 text-emerald-500" />}
                        </button>
                      ))}
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panels */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        type="notifications"
      />

      <NotificationPanel
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        type="messages"
      />
    </div>
  );
}