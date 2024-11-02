import React from 'react';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { Calendar, DollarSign, User, Building, ArrowUpRight, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { Deal } from '../../types';
import type { DealCardPreferences } from '../modals/CustomizeDealModal';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  preferences: DealCardPreferences;
}

export default function DealCard({ deal, onClick, onDelete, preferences }: DealCardProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'deal',
    item: { id: deal.id, type: 'deal' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [deal.id]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(deal.id);
  };

  const renderCompactLayout = () => (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate group-hover:text-indigo-600">
          {deal.title}
        </h3>
        {preferences.showCompany && (
          <p className="text-sm text-gray-500 truncate">{deal.accountName}</p>
        )}
      </div>
      <div className="ml-4 flex items-center space-x-2">
        {preferences.showValue && (
          <span className="text-sm font-medium text-gray-900">
            ${deal.value.toLocaleString()}
          </span>
        )}
        {preferences.showProbability && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {deal.probability}%
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDefaultLayout = () => (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {deal.title}
          </h3>
          <div className="flex items-center mt-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              {deal.stage}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              ID: {deal.id.slice(0, 8)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.div>
        </div>
      </div>

      {/* Value and Probability */}
      {(preferences.showValue || preferences.showProbability) && (
        <div className="flex items-center justify-between mb-3">
          {preferences.showValue && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 text-gray-400 mr-1.5" />
              <span className="font-medium text-gray-900">
                ${deal.value.toLocaleString()}
              </span>
            </div>
          )}
          {preferences.showProbability && (
            <div className="flex items-center">
              <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {deal.probability}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 text-sm">
        {preferences.showDates && (
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>
              {new Date(deal.expectedCloseDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {preferences.showCompany && (
          <div className="flex items-center text-gray-500">
            <Building className="h-4 w-4 mr-1.5" />
            <span className="truncate">{deal.accountName}</span>
          </div>
        )}

        {preferences.showOwner && (
          <div className="flex items-center text-gray-500">
            <User className="h-4 w-4 mr-1.5" />
            <span className="truncate">{deal.ownerName}</span>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {preferences.showProgress && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{getProgressPercentage(deal.stage)}%</span>
          </div>
          <div className="mt-1 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(deal.stage)}%` }}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <motion.div
      ref={dragRef}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick(deal)}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all group ${
        preferences.layout === 'compact' ? 'p-3' : 'p-4'
      }`}
    >
      {preferences.layout === 'compact' ? renderCompactLayout() : renderDefaultLayout()}
    </motion.div>
  );
}

function getProgressPercentage(stage: string): number {
  const stages = {
    'Lead': 20,
    'Qualified': 40,
    'Proposal': 60,
    'Negotiation': 80,
    'Closed Won': 100,
    'Closed Lost': 0,
  };
  return stages[stage as keyof typeof stages] || 0;
}