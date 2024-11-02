import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import DealCard from './DealCard';
import { Button } from '../ui/button';
import type { Deal } from '../../types';
import type { DealCardPreferences } from '../modals/CustomizeDealModal';

interface DealColumnProps {
  stage: string;
  deals: Deal[];
  onDrop: (dealId: string, stage: string) => void;
  onDealClick: (deal: Deal) => void;
  onCustomize: () => void;
  onDeleteDeal: (dealId: string) => void;
  preferences: DealCardPreferences;
}

export default function DealColumn({
  stage,
  deals,
  onDrop,
  onDealClick,
  onCustomize,
  onDeleteDeal,
  preferences
}: DealColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'deal',
    drop: (item: { id: string }) => onDrop(item.id, stage),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const stageColorMap: Record<string, string> = {
    'Lead': 'bg-purple-100',
    'Qualified': 'bg-blue-100',
    'Proposal': 'bg-yellow-100',
    'Negotiation': 'bg-orange-100',
    'Closed Won': 'bg-green-100',
    'Closed Lost': 'bg-red-100',
    'New Request': 'bg-purple-100',
    'In Progress': 'bg-blue-100',
    'Under Review': 'bg-yellow-100',
    'Completed': 'bg-green-100',
    'Cancelled': 'bg-red-100'
  };

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-80 flex flex-col ${
        isOver ? 'bg-gray-50' : 'bg-gray-100'
      } rounded-lg transition-colors duration-200`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${stageColorMap[stage]}`} />
            <h3 className="font-medium text-gray-900">{stage}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <span className="text-sm text-gray-500">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
              </span>
              {deals.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                </span>
              )}
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCustomize}
              className="text-gray-400 hover:text-gray-500"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Deals List */}
      <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)] px-4 pb-4">
        <div className="space-y-3">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={onDealClick}
              onDelete={onDeleteDeal}
              preferences={preferences}
            />
          ))}
          
          {/* Empty State */}
          {deals.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg"
            >
              <p className="text-sm text-gray-500">Drop deals here</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}