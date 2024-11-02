import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  TrendingUp,
  Users,
  Target,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Plus,
  Brain,
  Sparkles,
  Filter,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import type { Campaign } from '../types/campaigns';

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale Campaign',
    type: 'email',
    status: 'active',
    budget: 5000,
    spent: 2500,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    targets: [
      { type: 'demographic', value: '25-45', reach: 50000 },
      { type: 'location', value: 'US', reach: 100000 }
    ],
    metrics: {
      impressions: 75000,
      clicks: 3500,
      conversions: 250,
      cost: 2500,
      revenue: 12500,
      roi: 400
    },
    content: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Product Launch',
    type: 'social',
    status: 'draft',
    budget: 10000,
    spent: 0,
    startDate: new Date('2024-07-01'),
    targets: [
      { type: 'interest', value: 'Technology', reach: 75000 },
      { type: 'behavior', value: 'Early Adopters', reach: 25000 }
    ],
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cost: 0,
      revenue: 0,
      roi: 0
    },
    content: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const CHANNEL_METRICS = [
  {
    name: 'Email Marketing',
    icon: Mail,
    stats: {
      reach: '45K',
      engagement: '22%',
      conversion: '3.5%'
    }
  },
  {
    name: 'Instagram',
    icon: Instagram,
    stats: {
      reach: '120K',
      engagement: '4.8%',
      conversion: '2.1%'
    }
  },
  {
    name: 'Facebook',
    icon: Facebook,
    stats: {
      reach: '250K',
      engagement: '3.2%',
      conversion: '1.8%'
    }
  },
  {
    name: 'Twitter',
    icon: Twitter,
    stats: {
      reach: '85K',
      engagement: '2.9%',
      conversion: '1.2%'
    }
  }
];

export default function Marketing() {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const averageROI = campaigns.reduce((sum, campaign) => sum + campaign.metrics.roi, 0) / campaigns.length;

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
              <Megaphone className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
            </motion.div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Track and optimize your marketing campaigns
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="flex items-center bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-8 space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Total Budget
                  </span>
                </div>
                <span className="text-sm text-green-500">+12.5%</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                ${totalBudget.toLocaleString()}
              </p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  ${totalSpent.toLocaleString()} spent
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Average ROI
                  </span>
                </div>
                <span className="text-sm text-green-500">+8.3%</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {averageROI.toFixed(1)}%
              </p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Across all campaigns
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Total Reach
                  </span>
                </div>
                <span className="text-sm text-green-500">+15.2%</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                500K+
              </p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Across all channels
                </span>
              </div>
            </motion.div>
          </div>

          {/* Channel Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Channel Performance</h2>
            <div className="grid grid-cols-2 gap-6">
              {CHANNEL_METRICS.map((channel) => (
                <motion.div
                  key={channel.name}
                  whileHover={{ y: -2 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <channel.icon className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 font-medium text-gray-900">{channel.name}</span>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Reach</p>
                      <p className="text-sm font-medium text-gray-900">{channel.stats.reach}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Engagement</p>
                      <p className="text-sm font-medium text-gray-900">{channel.stats.engagement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversion</p>
                      <p className="text-sm font-medium text-gray-900">{channel.stats.conversion}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  whileHover={{ y: -2 }}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">{campaign.type}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${campaign.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${campaign.spent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className="text-sm font-medium text-gray-900">
                        {campaign.metrics.roi}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="text-sm font-medium text-gray-900">
                        {campaign.metrics.conversions}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                <h2 className="font-semibold">Marketing Assistant</h2>
              </div>
              <Sparkles className="h-5 w-5 text-indigo-200" />
            </div>
            <p className="text-sm text-indigo-100 mb-4">
              I can help optimize your campaigns and identify new opportunities.
            </p>
            <Button
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Get Recommendations
            </Button>
          </motion.div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {/* Activity items would go here */}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}