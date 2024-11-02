import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Key, RefreshCcw, Shield, Users } from 'lucide-react';
import { HighLevelService } from '../../services/integrations/HighLevelService';
import { IntegrationService } from '../../services/integrations/IntegrationService';

interface HighLevelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIntegrate: (apiKey: string) => void;
}

export default function HighLevelModal({ open, onOpenChange, onIntegrate }: HighLevelModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [contactCount, setContactCount] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTestConnection = async () => {
    if (!apiKey.trim() || !user?.accountId) {
      toast({
        title: "Error",
        description: "API key is required",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      // Initialize HighLevel service
      const highLevel = new HighLevelService(apiKey, user.accountId);

      // Test the connection
      const isValid = await highLevel.testConnection();
      if (!isValid) {
        throw new Error('Connection test failed');
      }

      // Get contact count
      const count = await highLevel.getContactCount();
      setContactCount(count);

      // Create the integration in Firestore
      const integration = await IntegrationService.createIntegration(
        'crm',
        'HighLevel',
        {
          apiKey,
          accountId: user.accountId
        }
      );

      // Start initial sync
      await highLevel.syncContacts();

      toast({
        title: "Integration successful",
        description: `Connected to HighLevel successfully. Found ${count.toLocaleString()} contacts.`,
      });

      onIntegrate(apiKey);
    } catch (error) {
      console.error('Failed to test HighLevel connection:', error);
      toast({
        title: "Integration failed",
        description: error instanceof Error ? error.message : "Failed to connect to HighLevel",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <img
              src="/integrations/highlevel-logo.png"
              alt="HighLevel"
              className="h-6 w-6"
            />
            <span>Connect to HighLevel</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-6">
            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your HighLevel API key"
                />
              </div>
              <p className="text-sm text-gray-500">
                You can find your API key in your HighLevel account settings.
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Secure Integration
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Your API key is encrypted and stored securely. We only use it to
                    sync your HighLevel contacts and leads.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Count */}
            {contactCount !== null && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-900">
                      Connection Successful
                    </h4>
                    <p className="mt-1 text-sm text-green-700">
                      Found {contactCount.toLocaleString()} contacts in your HighLevel account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sync Options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Data to Sync</h4>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                  Contact Information (Name, Email, Phone)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                  Tags and Labels
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                  Lead Status
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={!apiKey.trim() || testing}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {testing ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Connect to HighLevel'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}