import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Users,
  Mail,
  Phone,
  Building2,
  Tag,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import type { Contact } from '../../types';

interface ContactInsightsProps {
  selectedContact: Contact | null;
  totalContacts: number;
}

export default function ContactInsights({ selectedContact, totalContacts }: ContactInsightsProps) {
  const insights = [
    {
      title: 'Engagement Score',
      value: '85%',
      change: '+12%',
      description: 'Higher than average',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Response Time',
      value: '2.5h',
      change: '-30m',
      description: 'Faster than last month',
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      title: 'Similar Contacts',
      value: '12',
      description: 'In the same industry',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  const suggestions = [
    'Schedule a follow-up meeting',
    'Update contact information',
    'Add to marketing campaign',
    'Review engagement history'
  ];

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-4 text-white"
      >
        <div className="flex items-center mb-3">
          <Brain className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <p className="text-sm text-indigo-100">
          Analyzing {totalContacts} contacts to provide insights and recommendations.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${insight.color} bg-opacity-10`}>
                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {insight.title}
                  </p>
                  <p className="text-xs text-gray-500">{insight.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {insight.value}
                </p>
                {insight.change && (
                  <p className={`text-xs ${
                    insight.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {insight.change}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Suggested Actions</h3>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full flex items-center justify-between p-3 text-left text-sm hover:bg-gray-50 rounded-lg group"
            >
              <span className="text-gray-700">{suggestion}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-indigo-600 opacity-0 group-hover:opacity-100"
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Contact Details */}
      {selectedContact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Contact Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900">{selectedContact.email}</span>
            </div>
            {selectedContact.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{selectedContact.phone}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Building2 className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900">
                {selectedContact.position} at {selectedContact.company}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Tag className="h-4 w-4 text-gray-400 mr-2" />
              <div className="flex flex-wrap gap-1">
                {selectedContact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}