import React, { useState } from 'react';
import { Plus, Settings, Play, AlertCircle } from 'lucide-react';
import type { PipelineAutomation, AutomationTrigger, AutomationCondition, AutomationAction } from '../../types/pipeline';

interface AutomationBuilderProps {
  automation: PipelineAutomation;
  onUpdate: (automation: PipelineAutomation) => void;
}

export default function AutomationBuilder({ automation, onUpdate }: AutomationBuilderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleTriggerChange = (trigger: AutomationTrigger) => {
    onUpdate({ ...automation, trigger });
  };

  const handleAddCondition = (condition: AutomationCondition) => {
    onUpdate({
      ...automation,
      conditions: [...automation.conditions, condition]
    });
  };

  const handleAddAction = (action: AutomationAction) => {
    onUpdate({
      ...automation,
      actions: [...automation.actions, action]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">{automation.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdate({ ...automation, enabled: !automation.enabled })}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              automation.enabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              automation.enabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <Play className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="space-y-4">
          {/* Trigger Section */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              When
            </h4>
            {/* Add trigger configuration UI */}
          </div>

          {/* Conditions Section */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              If
            </h4>
            <div className="space-y-2">
              {automation.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {/* Add condition display/edit UI */}
                </div>
              ))}
              <button
                onClick={() => handleAddCondition({
                  field: '',
                  operator: 'equals',
                  value: ''
                })}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </button>
            </div>
          </div>

          {/* Actions Section */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Then
            </h4>
            <div className="space-y-2">
              {automation.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {/* Add action display/edit UI */}
                </div>
              ))}
              <button
                onClick={() => handleAddAction({
                  type: 'move_stage',
                  config: {}
                })}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </button>
            </div>
          </div>
        </div>
      )}

      {automation.enabled && automation.actions.length === 0 && (
        <div className="mt-2 flex items-center text-sm text-yellow-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          This automation has no actions configured
        </div>
      )}
    </div>
  );
}