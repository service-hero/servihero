import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2, Check, Search, AlertCircle, Users, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import { useAccount } from '../../contexts/AccountContext';
import { Button } from '../ui/button';

interface AccountSwitcherProps {
  isCollapsed?: boolean;
}

export default function AccountSwitcher({ isCollapsed = false }: AccountSwitcherProps) {
  const { currentAccount, accounts, switchAccount, loading, error } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate main account and sub-accounts
  const mainAccount = accounts.find(account => !account.parentAccountId);
  const subAccounts = accounts.filter(account => account.parentAccountId);

  // Loading state
  if (loading) {
    return (
      <div className="w-full p-2 flex justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full p-2 flex items-center justify-center text-red-400 text-sm">
        <AlertCircle className="w-4 h-4 mr-2" />
        <span>Failed to load accounts</span>
      </div>
    );
  }

  // Collapsed state
  if (isCollapsed) {
    return (
      <button
        className="w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-medium">
            {currentAccount?.name.charAt(0)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 flex items-center justify-between hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium">
              {currentAccount?.name.charAt(0)}
            </span>
          </div>
          <div className="ml-3 text-left">
            <p className="text-sm font-medium text-white truncate max-w-[140px]">
              {currentAccount?.name}
            </p>
            <p className="text-xs text-gray-400">
              {currentAccount?.type === 'agency' ? 'Agency' : 'Client'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 mt-2 mx-2 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-50"
            >
              <div className="p-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search accounts..."
                  className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                />
              </div>

              <ScrollArea className="max-h-[400px]">
                <div className="p-2">
                  {/* Main Account */}
                  {mainAccount && (
                    <div className="mb-4">
                      <div className="px-2 mb-2 flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs font-medium text-gray-400">
                          AGENCY ACCOUNT
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          switchAccount(mainAccount);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full px-2 py-2 flex items-center rounded-lg",
                          mainAccount.id === currentAccount?.id
                            ? "bg-indigo-600"
                            : "hover:bg-gray-800"
                        )}
                      >
                        <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium">
                            {mainAccount.name.charAt(0)}
                          </span>
                        </div>
                        <span className="ml-3 text-sm text-white">
                          {mainAccount.name}
                        </span>
                        {mainAccount.id === currentAccount?.id && (
                          <Check className="ml-auto w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Sub Accounts */}
                  {subAccounts.length > 0 && (
                    <div>
                      <div className="px-2 mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs font-medium text-gray-400">
                            CLIENT ACCOUNTS
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {subAccounts.map((account) => (
                          <button
                            key={account.id}
                            onClick={() => {
                              switchAccount(account);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "w-full px-2 py-2 flex items-center rounded-lg",
                              account.id === currentAccount?.id
                                ? "bg-indigo-600"
                                : "hover:bg-gray-800"
                            )}
                          >
                            <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium">
                                {account.name.charAt(0)}
                              </span>
                            </div>
                            <span className="ml-3 text-sm text-white">
                              {account.name}
                            </span>
                            {account.id === currentAccount?.id && (
                              <Check className="ml-auto w-4 h-4 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredAccounts.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">
                        No accounts found
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}