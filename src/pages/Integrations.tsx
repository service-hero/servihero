import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Plug, RefreshCcw, Settings, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import IntegrationCard from '../components/integrations/IntegrationCard';
import HighLevelModal from '../components/integrations/HighLevelModal';
import type { Integration } from '../types/integrations';

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'highlevel',
    name: 'HighLevel',
    description: 'Sync leads and contacts from your HighLevel account',
    icon: '/integrations/highlevel-logo.png',
    status: 'available',
    category: 'CRM',
    features: [
      'Lead synchronization',
      'Contact import',
      'Tag management',
      'Automated syncing'
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect your CRM with 3000+ apps',
    icon: '/integrations/zapier-logo.png',
    status: 'available',
    category: 'Automation',
    features: [
      'Custom workflows',
      'Automated tasks',
      'Data synchronization',
      'Multi-app integration'
    ]
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Sync your contacts with Mailchimp for email marketing',
    icon: '/integrations/mailchimp-logo.png',
    status: 'available',
    category: 'Marketing',
    features: [
      'Contact synchronization',
      'Email campaigns',
      'Audience segmentation',
      'Marketing automation'
    ]
  }
];

export default function Integrations() {
  const [showHighLevelModal, setShowHighLevelModal] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState<Integration | null>(null);

  const handleIntegrationClick = (integration: typeof AVAILABLE_INTEGRATIONS[0]) => {
    if (integration.id === 'highlevel') {
      setShowHighLevelModal(true);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center"
            >
              <Plug className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
            </motion.div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Connect and manage your external service integrations
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {activeIntegration && (
            <Button variant="outline" className="flex items-center">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          )}
          <Button variant="outline" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_INTEGRATIONS.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onClick={() => handleIntegrationClick(integration)}
            isActive={activeIntegration?.type === integration.id}
          />
        ))}

        {/* Add Integration Card */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-indigo-300 hover:bg-gray-50/50 transition-colors"
        >
          <Plus className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">Add Integration</p>
          <p className="text-xs mt-1">More integrations coming soon</p>
        </motion.div>
      </div>

      {/* HighLevel Integration Modal */}
      <HighLevelModal
        open={showHighLevelModal}
        onOpenChange={setShowHighLevelModal}
        onIntegrate={(apiKey) => {
          console.log('Integrating with API key:', apiKey);
          setActiveIntegration({
            id: 'highlevel',
            type: 'crm',
            name: 'HighLevel',
            config: { apiKey },
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          setShowHighLevelModal(false);
        }}
      />
    </div>
  );
}