import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Bell, MessageSquare, X, Check, Clock } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'notification' | 'message';
  sender?: {
    name: string;
    avatar: string;
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'notifications' | 'messages';
}

// Mock data - replace with real data in production
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'A new lead has been assigned to you',
    timestamp: new Date(),
    read: false,
    type: 'notification'
  },
  {
    id: '2',
    title: 'Deal Status Updated',
    message: 'The deal "Enterprise Software" has been moved to Negotiation stage',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    type: 'notification'
  },
  {
    id: '3',
    title: 'Message from John Doe',
    message: 'Hey, can we discuss the proposal?',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    type: 'message',
    sender: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  }
];

type TabType = 'all' | 'unread' | 'read';

export default function NotificationPanel({ isOpen, onClose, type }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const allNotifications = MOCK_NOTIFICATIONS.filter(n => 
    type === 'notifications' ? n.type === 'notification' : n.type === 'message'
  );

  const filteredNotifications = allNotifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return true;
  });

  const unreadCount = allNotifications.filter(n => !n.read).length;
  const readCount = allNotifications.filter(n => n.read).length;

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: allNotifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'read', label: 'Read', count: readCount }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg z-50"
          >
            {/* Header */}
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-2">
                  {type === 'notifications' ? (
                    <>
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold">Notifications</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold">Messages</span>
                    </>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 -mb-px flex space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative py-2 text-sm font-medium transition-colors focus:outline-none",
                      activeTab === tab.id
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={cn(
                        "ml-2 rounded-full px-2 py-0.5 text-xs",
                        activeTab === tab.id
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-600"
                      )}>
                        {tab.count}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="px-6 py-4">
                <AnimatePresence mode="wait">
                  {filteredNotifications.length > 0 ? (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {filteredNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg ${
                            notification.read ? 'bg-gray-50' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            {notification.sender ? (
                              <img
                                src={notification.sender.avatar}
                                alt={notification.sender.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Bell className="h-5 w-5 text-indigo-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {notification.message}
                              </p>
                              <div className="mt-2 flex items-center space-x-4">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(notification.timestamp, 'MMM d, h:mm a')}
                                </div>
                                {notification.read && (
                                  <div className="flex items-center text-xs text-green-600">
                                    <Check className="h-4 w-4 mr-1" />
                                    Read
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-gray-500">
                        No {activeTab === 'all' ? '' : activeTab} {type} to display
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}