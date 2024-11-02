export type PipelineType = 'sales' | 'service' | 'project' | 'recruitment';

export interface Pipeline {
  id: string;
  name: string;
  type: PipelineType;
  stages: PipelineStage[];
  automations: PipelineAutomation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
  requirements?: string[];
  automations?: StageAutomation[];
}

export interface PipelineAutomation {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
}

export interface StageAutomation {
  type: 'task' | 'email' | 'notification';
  config: Record<string, any>;
}

export type AutomationTrigger =
  | { type: 'stage_enter'; stageId: string }
  | { type: 'stage_exit'; stageId: string }
  | { type: 'deal_value_change' }
  | { type: 'deal_probability_change' }
  | { type: 'deal_age'; days: number }
  | { type: 'task_completed'; taskType?: string };

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface AutomationAction {
  type: 'move_stage' | 'create_task' | 'send_email' | 'notify_user';
  config: Record<string, any>;
}