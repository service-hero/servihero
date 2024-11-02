import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Plus,
  Brain,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import type { Agency } from '../types';

const MOCK_AGENCIES: Agency[] = [
  {
    id: '1',
    name: 'Hero Heating And Air',
    industry: 'HVAC',
    clientCount: 48,
    activeProjects: 12,
    monthlyRevenue: 125000,
    revenueTarget: 150000,
    clients: ['1', '2', '3'],
    users: ['1', '2'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Cool Tech Solutions',
    industry: 'Technology',
    clientCount: 35,
    activeProjects: 8,
    monthlyRevenue: 95000,
    revenueTarget: 120000,
    clients: ['4', '5'],
    users: ['3', '4'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function Agency() {
  const [agencies] = useState<Agency[]>(MOCK_AGENCIES);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const totalRevenue = agencies.reduce((sum, agency) => sum + agency.monthlyRevenue, 0);
  const totalClients = agencies.reduce((sum, agency) => sum + agency.clientCount, 0);
  const averageRevenue = totalRevenue / agencies.length;

  const metrics = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15.8%',
      icon: DollarSign,
      color: 'text-emerald-500'
    },
    {
      label: 'Total Clients',
      value: totalClients,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Avg. Revenue',
      value: `$${averageRevenue.toLocaleString()}`,
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

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
              <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Agency Management</h1>
            </motion.div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage your agencies and their performance
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="flex items-center bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Agency
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {metric.label}
                </span>
              </div>
              <span className={`text-sm ${
                metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Agency List */}
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-6">
            {agencies.map((agency) => (
              <motion.div
                key={agency.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
                onClick={() => setSelectedAgency(agency)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{agency.name}</h3>
                      <p className="text-sm text-gray-500">{agency.industry}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Clients</p>
                    <p className="text-lg font-medium text-gray-900">{agency.clientCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Projects</p>
                    <p className="text-lg font-medium text-gray-900">{agency.activeProjects}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Monthly Revenue</span>
                    <span className="font-medium text-gray-900">
                      ${agency.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(agency.monthlyRevenue / agency.revenueTarget) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((agency.monthlyRevenue / agency.revenueTarget) * 100)}% of target
                  </p>
                </div>
              </motion.div>
            ))}
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
                <h2 className="font-semibold">Agency Assistant</h2>
              </div>
              <Sparkles className="h-5 w-5 text-indigo-200" />
            </div>
            <p className="text-sm text-indigo-100 mb-4">
              I can help you optimize your agency performance and identify growth opportunities.
            </p>
            <Button
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              View Insights
            </Button>
          </motion.div>

          {selectedAgency && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Selected Agency</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-base font-medium text-gray-900">{selectedAgency.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-base font-medium text-gray-900">{selectedAgency.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Performance</p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${selectedAgency.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Clients</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedAgency.clientCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}