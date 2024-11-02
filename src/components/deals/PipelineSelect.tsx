import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Settings, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

interface PipelineSelectProps {
  selectedPipeline: string;
  pipelines: Array<{ id: string; name: string }>;
  onPipelineChange: (pipelineId: string) => void;
  onOpenSettings: () => void;
}

export default function PipelineSelect({
  selectedPipeline,
  pipelines,
  onPipelineChange,
  onOpenSettings
}: PipelineSelectProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Select value={selectedPipeline} onValueChange={onPipelineChange}>
          <SelectTrigger className="w-full">
            <div className="flex items-center">
              <GitBranch className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Select pipeline" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            {pipelines.map((pipeline) => (
              <SelectItem key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </SelectItem>
            ))}
            <motion.div
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              className="px-2 py-1.5 -mx-1"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenSettings();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Pipeline
              </Button>
            </motion.div>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSettings}
        className="text-gray-500 hover:text-gray-700"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}