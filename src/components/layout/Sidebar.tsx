import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from '../../contexts/AccountContext';
import AccountSwitcher from './AccountSwitcher';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  PieChart,
  Settings,
  ChevronDown,
  Folder,
  Building2,
  Calculator,
  HelpCircle,
  Sparkles,
  PanelLeftClose,
  GitMerge,
  Brain,
  Megaphone,
  Plug,
  Webhook,
  KeyRound
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onSettingsClick: () => void;
}

export default function Sidebar({ onSettingsClick }: SidebarProps) {
  const location = useLocation();
  const { currentAccount, accounts, switchAccount } = useAccount();
  const [expanded, setExpanded] = useState<string[]>(['DASHBOARD', 'WORKSPACE', 'INTEGRATIONS']);
  const [aiHighlight, setAiHighlight] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Overview', href: '/', icon: LayoutDashboard },
        { name: 'Deals', href: '/deals', icon: GitMerge, badge: 5, aiSuggested: true }
      ]
    },
    {
      title: 'WORKSPACE',
      items: [
        { name: 'Contacts', href: '/contacts', icon: Users, aiSuggested: true },
        { name: 'Chat', href: '/chat', icon: MessageSquare },
        { name: 'Analytics', href: '/analytics', icon: PieChart },
        { name: 'Tasks', href: '/tasks', icon: Folder, badge: 3 },
        { name: 'Agency', href: '/agency', icon: Building2 },
        { name: 'Marketing', href: '/marketing', icon: Megaphone },
        { name: 'Calculator', href: '/calculator', icon: Calculator },
        { name: 'Help', href: '/help', icon: HelpCircle }
      ]
    },
    {
      title: 'INTEGRATIONS',
      items: [
        { name: 'Connected Apps', href: '/integrations', icon: Plug },
        { name: 'Webhooks', href: '/webhooks', icon: Webhook },
        { name: 'API Keys', href: '/settings/api-keys', icon: KeyRound }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const suggestedItems = navigation
        .flatMap(section => section.items)
        .filter(item => item.aiSuggested);
      
      if (suggestedItems.length > 0) {
        const randomItem = suggestedItems[Math.floor(Math.random() * suggestedItems.length)];
        setAiHighlight(randomItem.href);
        setTimeout(() => setAiHighlight(null), 3000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleSection = (title: string) => {
    setExpanded(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <div className={cn(
      "flex flex-col bg-gray-900 h-screen sticky top-0 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with Account Switcher */}
      <div className="flex flex-col p-2 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        <AccountSwitcher
          accounts={accounts}
          currentAccount={currentAccount}
          onAccountChange={switchAccount}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {navigation.map((section) => (
          <div key={section.title} className="px-3 mb-6">
            {!isCollapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full mb-2 px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-200"
              >
                {section.title}
                <motion.div
                  animate={{ rotate: expanded.includes(section.title) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            )}
            
            <AnimatePresence>
              {(isCollapsed || expanded.includes(section.title)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    const isHighlighted = aiHighlight === item.href;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "relative flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive 
                            ? "bg-indigo-600 text-white" 
                            : "text-gray-300 hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center space-x-3 relative z-10">
                          <item.icon 
                            className={cn(
                              "w-5 h-5",
                              isActive ? "text-white" : "text-gray-400"
                            )}
                          />
                          {!isCollapsed && <span>{item.name}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            isActive 
                              ? "bg-indigo-500 text-white" 
                              : "bg-gray-800 text-gray-300"
                          )}>
                            {item.badge}
                          </span>
                        )}

                        {isHighlighted && (
                          <motion.div
                            layoutId="highlight"
                            className="absolute inset-0 bg-indigo-500 rounded-lg -z-10"
                            initial={{ opacity: 0.05, scale: 0.98 }}
                            animate={{ 
                              opacity: [0.05, 0.1, 0.05],
                              scale: [0.98, 1.02, 0.98]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={onSettingsClick}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            "text-gray-300 hover:bg-gray-800 w-full"
          )}
        >
          <Settings className="w-5 h-5 text-gray-400" />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </button>
      </div>
    </div>
  );
}