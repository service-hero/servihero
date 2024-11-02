import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Sparkles } from 'lucide-react';
import MetricsRow from '../components/dashboard/MetricsRow';
import LeadsPieChart from '../components/dashboard/LeadsPieChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center"
          >
            <BarChart3 className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-gray-500"
          >
            Welcome back! Here's what's happening today.
          </motion.p>
        </div>

        {/* AI Assistant Button */}
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none hover:from-indigo-600 hover:to-purple-600"
        >
          <Brain className="h-4 w-4" />
          <span>AI Assistant</span>
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      {/* AI Insights Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100 rounded-lg p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">AI Insights</h3>
            <p className="text-sm text-indigo-700">
              Your lead conversion rate has increased by 15% this week. Consider reaching out to high-value prospects.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid - First Two Rows */}
      <div className="space-y-4">
        <MetricsRow 
          title="Revenue Metrics"
          metrics={[
            { id: 'total-revenue', title: 'Total Revenue', value: 125000, change: 15.8, type: 'currency' },
            { id: 'mrr', title: 'Monthly Recurring Revenue', value: 25000, change: 8.2, type: 'currency' },
            { id: 'avg-deal', title: 'Average Deal Size', value: 5000, change: 12.5, type: 'currency' },
            { id: 'pipeline', title: 'Pipeline Value', value: 500000, change: 20.1, type: 'currency' }
          ]} 
        />
        <MetricsRow 
          title="Lead Metrics"
          metrics={[
            { id: 'total-leads', title: 'Total Leads', value: 145, change: 10.5, type: 'number' },
            { id: 'qualified-leads', title: 'Qualified Leads', value: 48, change: 15.2, type: 'number' },
            { id: 'conversion-rate', title: 'Conversion Rate', value: 35, change: 5.8, type: 'percentage' },
            { id: 'response-time', title: 'Avg Response Time', value: 2.5, change: -12.4, type: 'hours' }
          ]} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Sources</h3>
          <LeadsPieChart />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}