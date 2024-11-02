import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Settings, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type PipelineStage = {
  id: string;
  name: string;
  probability: number;
};

type Pipeline = {
  id: string;
  name: string;
  stages: PipelineStage[];
};

interface PipelineSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPipelineCreate?: (pipeline: { id: string; name: string }) => void;
}

export default function PipelineSettingsModal({ 
  open, 
  onOpenChange,
  onPipelineCreate 
}: PipelineSettingsModalProps) {
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [newPipelineName, setNewPipelineName] = useState('');
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 'sales',
      name: 'Sales Pipeline',
      stages: [
        { id: 'qualified', name: 'Qualified', probability: 20 },
        { id: 'contact', name: 'Contact Made', probability: 40 },
        { id: 'demo', name: 'Demo Scheduled', probability: 60 },
        { id: 'proposal', name: 'Proposal Made', probability: 80 },
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing Pipeline',
      stages: [],
    },
  ]);

  const handleAddPipeline = () => {
    if (!newPipelineName.trim()) return;

    const newPipeline = {
      id: newPipelineName.toLowerCase().replace(/\s+/g, '-'),
      name: newPipelineName,
      stages: [],
    };

    setPipelines([...pipelines, newPipeline]);
    onPipelineCreate?.({ id: newPipeline.id, name: newPipeline.name });
    setNewPipelineName('');
  };

  const handleAddStage = (pipelineId: string) => {
    setPipelines(
      pipelines.map((pipeline) =>
        pipeline.id === pipelineId
          ? {
              ...pipeline,
              stages: [
                ...pipeline.stages,
                {
                  id: `stage-${pipeline.stages.length + 1}`,
                  name: `New Stage ${pipeline.stages.length + 1}`,
                  probability: 0,
                },
              ],
            }
          : pipeline
      )
    );
  };

  const handleRemoveStage = (pipelineId: string, stageId: string) => {
    setPipelines(
      pipelines.map((pipeline) =>
        pipeline.id === pipelineId
          ? {
              ...pipeline,
              stages: pipeline.stages.filter((stage) => stage.id !== stageId),
            }
          : pipeline
      )
    );
  };

  const currentPipeline = pipelines.find((p) => p.id === selectedPipeline);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-indigo-600" />
            <span>Pipeline Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pipeline Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Pipeline</label>
            <div className="relative">
              <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a pipeline" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {pipelines.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add New Pipeline */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Add New Pipeline</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter pipeline name"
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAddPipeline}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Pipeline
              </Button>
            </div>
          </div>

          {/* Pipeline Stages */}
          {currentPipeline && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Pipeline Stages</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddStage(currentPipeline.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {currentPipeline.stages.map((stage, index) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <Input
                          value={stage.name}
                          onChange={(e) =>
                            setPipelines(
                              pipelines.map((p) =>
                                p.id === currentPipeline.id
                                  ? {
                                      ...p,
                                      stages: p.stages.map((s) =>
                                        s.id === stage.id
                                          ? { ...s, name: e.target.value }
                                          : s
                                      ),
                                    }
                                  : p
                              )
                            )
                          }
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={stage.probability}
                          onChange={(e) =>
                            setPipelines(
                              pipelines.map((p) =>
                                p.id === currentPipeline.id
                                  ? {
                                      ...p,
                                      stages: p.stages.map((s) =>
                                        s.id === stage.id
                                          ? {
                                              ...s,
                                              probability: parseInt(e.target.value, 10),
                                            }
                                          : s
                                      ),
                                    }
                                  : p
                              )
                            )
                          }
                          className="text-center"
                        />
                      </div>
                      {index < currentPipeline.stages.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStage(currentPipeline.id, stage.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}