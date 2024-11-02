import { db } from '../../db';
import type { Pipeline, PipelineAutomation, Deal } from '../../types';

export class PipelineService {
  static async evaluateAutomations(deal: Deal): Promise<void> {
    const pipeline = await this.getPipeline(deal.pipelineId);
    if (!pipeline) return;

    for (const automation of pipeline.automations) {
      if (!automation.enabled) continue;

      const shouldTrigger = await this.evaluateTrigger(automation, deal);
      if (!shouldTrigger) continue;

      const conditionsMet = this.evaluateConditions(automation, deal);
      if (!conditionsMet) continue;

      await this.executeActions(automation, deal);
    }
  }

  private static async evaluateTrigger(
    automation: PipelineAutomation,
    deal: Deal
  ): Promise<boolean> {
    switch (automation.trigger.type) {
      case 'stage_enter':
        return deal.stage === automation.trigger.stageId;
      case 'stage_exit':
        // Compare with previous stage
        const previousDeal = await db.deals.get(deal.id);
        return previousDeal?.stage === automation.trigger.stageId;
      case 'deal_value_change':
        const previousValue = await this.getPreviousDealValue(deal.id);
        return deal.value !== previousValue;
      case 'deal_probability_change':
        const previousProb = await this.getPreviousDealProbability(deal.id);
        return deal.probability !== previousProb;
      case 'deal_age':
        const ageInDays = (Date.now() - deal.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return ageInDays >= automation.trigger.days;
      case 'task_completed':
        // Check if any related task was completed
        const tasks = await db.tasks
          .where('dealId')
          .equals(deal.id)
          .filter(task => 
            task.completed && 
            (!automation.trigger.taskType || task.type === automation.trigger.taskType)
          )
          .toArray();
        return tasks.length > 0;
      default:
        return false;
    }
  }

  private static evaluateConditions(
    automation: PipelineAutomation,
    deal: Deal
  ): boolean {
    return automation.conditions.every(condition => {
      const value = deal[condition.field as keyof Deal];
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'contains':
          return String(value).includes(condition.value);
        default:
          return false;
      }
    });
  }

  private static async executeActions(
    automation: PipelineAutomation,
    deal: Deal
  ): Promise<void> {
    for (const action of automation.actions) {
      switch (action.type) {
        case 'move_stage':
          await db.deals.update(deal.id, { stage: action.config.stageId });
          break;
        case 'create_task':
          await db.tasks.add({
            title: action.config.title,
            description: action.config.description,
            dealId: deal.id,
            assigneeId: action.config.assigneeId || deal.ownerId,
            dueDate: new Date(Date.now() + action.config.dueDays * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          break;
        case 'send_email':
          // Integrate with your email service
          break;
        case 'notify_user':
          // Integrate with your notification system
          break;
      }
    }
  }

  private static async getPreviousDealValue(dealId: string): Promise<number> {
    const deal = await db.deals.get(dealId);
    return deal?.value || 0;
  }

  private static async getPreviousDealProbability(dealId: string): Promise<number> {
    const deal = await db.deals.get(dealId);
    return deal?.probability || 0;
  }

  private static async getPipeline(pipelineId: string): Promise<Pipeline | undefined> {
    return db.pipelines.get(pipelineId);
  }
}