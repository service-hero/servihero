import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import DealCard from '../deals/DealCard';
import type { Deal } from '../../types';
import type { PipelineConfig } from '../../services/firestore/PipelineConfigService';

interface CustomizeDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (preferences: Partial<PipelineConfig>) => void;
  currentPreferences: Partial<PipelineConfig>;
  sampleDeal: Deal;
}

const AVAILABLE_FIELDS = [
  { id: 'value', label: 'Deal Value' },
  { id: 'probability', label: 'Probability' },
  { id: 'progress', label: 'Progress Bar' },
  { id: 'dates', label: 'Dates' },
  { id: 'owner', label: 'Owner' },
  { id: 'company', label: 'Company' },
];

export default function CustomizeDealModal({
  open,
  onOpenChange,
  onSave,
  currentPreferences,
  sampleDeal,
}: CustomizeDealModalProps) {
  const [preferences, setPreferences] = useState<Partial<PipelineConfig>>({
    ...currentPreferences,
    visibleFields: currentPreferences.visibleFields || []
  });

  // Update local state when currentPreferences changes
  useEffect(() => {
    setPreferences({
      ...currentPreferences,
      visibleFields: currentPreferences.visibleFields || []
    });
  }, [currentPreferences]);

  const handleToggleField = (fieldId: string) => {
    const fieldKey = `show${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}` as keyof PipelineConfig;
    setPreferences(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

  const handleLayoutChange = (layout: 'default' | 'compact') => {
    const newPreferences = {
      ...preferences,
      layout,
    };

    // Reset fields for compact layout
    if (layout === 'compact') {
      newPreferences.showProgress = false;
      newPreferences.showProbability = true;
      newPreferences.showValue = true;
      newPreferences.showDates = false;
      newPreferences.showOwner = false;
      newPreferences.showCompany = true;
    }

    setPreferences(newPreferences);
  };

  const handleSave = () => {
    // Update visible fields based on individual show flags
    const visibleFields = AVAILABLE_FIELDS
      .filter(field => preferences[`show${field.id.charAt(0).toUpperCase() + field.id.slice(1)}` as keyof PipelineConfig])
      .map(field => field.id);

    const updatedPreferences = {
      ...preferences,
      visibleFields,
      // Ensure all boolean flags are properly set
      showProgress: Boolean(preferences.showProgress),
      showProbability: Boolean(preferences.showProbability),
      showValue: Boolean(preferences.showValue),
      showDates: Boolean(preferences.showDates),
      showOwner: Boolean(preferences.showOwner),
      showCompany: Boolean(preferences.showCompany)
    };

    onSave(updatedPreferences);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customize Deal Cards</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Preview Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <DealCard
                deal={sampleDeal}
                onClick={() => {}}
                onDelete={() => {}}
                preferences={preferences as PipelineConfig}
              />
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-6">
            {/* Layout Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Layout</h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={preferences.layout === 'default'}
                    onChange={() => handleLayoutChange('default')}
                    className="text-indigo-600"
                  />
                  <span>Default</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={preferences.layout === 'compact'}
                    onChange={() => handleLayoutChange('compact')}
                    className="text-indigo-600"
                  />
                  <span>Compact</span>
                </label>
              </div>
            </div>

            {/* Visible Fields */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Visible Fields</h3>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {AVAILABLE_FIELDS.map((field) => {
                    const fieldKey = `show${field.id.charAt(0).toUpperCase() + field.id.slice(1)}` as keyof PipelineConfig;
                    const isDisabled = preferences.layout === 'compact' && ['progress', 'dates', 'owner'].includes(field.id);

                    return (
                      <label
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={preferences[fieldKey] as boolean}
                          onCheckedChange={() => handleToggleField(field.id)}
                          disabled={isDisabled}
                        />
                        <span className={`text-sm ${
                          isDisabled ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {field.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Apply Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}