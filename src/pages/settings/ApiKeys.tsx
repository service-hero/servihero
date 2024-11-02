import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { ApiKeyService } from '../../services/api/ApiKeyService';
import type { ApiKey } from '../../types/api';

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
  }, [user?.accountId]);

  const loadApiKeys = async () => {
    if (!user?.accountId) return;

    try {
      const keys = await ApiKeyService.getApiKeys(user.accountId);
      setApiKeys(keys);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!user?.accountId || !newKeyName.trim()) return;

    try {
      const newKey = await ApiKeyService.createApiKey({
        name: newKeyName,
        accountId: user.accountId,
        permissions: ['read', 'write'] // Add more granular permissions as needed
      });

      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');

      // Show the key only once
      toast({
        title: "API Key Created",
        description: (
          <div className="mt-2">
            <p className="mb-2">Keep this key safe! It won't be shown again.</p>
            <code className="bg-gray-100 p-2 rounded block break-all">
              {newKey.key}
            </code>
          </div>
        ),
      });
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      await ApiKeyService.revokeApiKey(keyId);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast({
        title: "Success",
        description: "API key revoked successfully",
      });
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage API keys for accessing your account programmatically.
        </p>
      </div>

      {/* Create New Key */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New API Key</h2>
        <div className="flex space-x-4">
          <Input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Enter key name"
            className="flex-1"
          />
          <Button
            onClick={handleCreateKey}
            disabled={!newKeyName.trim()}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Key
          </Button>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your API Keys</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {apiKeys.map((key) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Key className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">{key.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Created on {key.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(key.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeKey(key.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {apiKeys.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No API keys found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}