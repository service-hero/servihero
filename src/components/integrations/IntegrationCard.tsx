import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface IntegrationCardProps {
  integration: {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: string;
    category: string;
    features: string[];
  };
  onClick: () => void;
  isActive?: boolean;
}

export default function IntegrationCard({ integration, onClick, isActive }: IntegrationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center">
            {integration.icon ? (
              <img
                src={integration.icon}
                alt={integration.name}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">
                  {integration.name[0]}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {integration.name}
            </h3>
            <p className="text-sm text-gray-500">{integration.category}</p>
          </div>
        </div>
        {isActive ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-gray-400" />
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600">{integration.description}</p>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
        <ul className="space-y-1">
          {integration.features.map((feature) => (
            <li key={feature} className="text-sm text-gray-600 flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isActive ? 'Manage Integration' : 'Connect'}
        </Button>
      </div>
    </motion.div>
  );
}