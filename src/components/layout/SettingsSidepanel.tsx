import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Settings,
  User,
  Building2,
  CreditCard,
  Bell,
  Lock,
  Palette,
  Globe,
  KeyRound,
  Users,
  Plug,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SettingsSidepanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SETTINGS_SECTIONS = [
  {
    title: 'ACCOUNT',
    items: [
      { name: 'Profile', href: '/settings/profile', icon: User },
      { name: 'Organization', href: '/settings/organization', icon: Building2 },
      { name: 'Billing', href: '/settings/billing', icon: CreditCard },
      { name: 'Notifications', href: '/settings/notifications', icon: Bell }
    ]
  },
  {
    title: 'SECURITY',
    items: [
      { name: 'Password', href: '/settings/password', icon: Lock },
      { name: 'Two-Factor Auth', href: '/settings/2fa', icon: Shield },
      { name: 'API Keys', href: '/settings/api-keys', icon: KeyRound }
    ]
  },
  {
    title: 'PREFERENCES',
    items: [
      { name: 'Appearance', href: '/settings/appearance', icon: Palette },
      { name: 'Language', href: '/settings/language', icon: Globe }
    ]
  },
  {
    title: 'TEAM',
    items: [
      { name: 'Members', href: '/settings/team', icon: Users },
      { name: 'Roles', href: '/settings/roles', icon: Shield }
    ]
  },
  {
    title: 'INTEGRATIONS',
    items: [
      { name: 'Connected Apps', href: '/settings/integrations', icon: Plug }
    ]
  }
];

export default function SettingsSidepanel({ isOpen, onClose }: SettingsSidepanelProps) {
  const location = useLocation();

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
            className="fixed right-0 top-0 h-screen w-80 bg-gray-900 text-gray-100 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center h-16 px-4 border-b border-gray-800">
              <Settings className="w-5 h-5 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>

            {/* Navigation */}
            <div className="py-4">
              {SETTINGS_SECTIONS.map((section) => (
                <div key={section.title} className="mb-6 px-3">
                  <h3 className="text-xs font-semibold text-gray-400 px-2 mb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <motion.a
                          key={item.href}
                          href={item.href}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative group",
                            isActive 
                              ? "bg-indigo-600 text-white" 
                              : "text-gray-300 hover:bg-gray-800"
                          )}
                        >
                          <item.icon className={cn(
                            "w-5 h-5 mr-3",
                            isActive ? "text-white" : "text-gray-400"
                          )} />
                          {item.name}

                          {/* Hover Effect */}
                          <motion.div
                            layoutId="hoverEffect"
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <div className="text-xs text-gray-400 text-center">
                Settings • v1.0.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}