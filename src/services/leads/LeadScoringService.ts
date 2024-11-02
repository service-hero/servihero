import type { Lead, LeadScore } from '../../types/leads';

export class LeadScoringService {
  calculateDemographicScore(lead: Lead): number {
    let score = 0;

    // Company presence
    if (lead.company) score += 10;
    
    // Position scoring
    if (lead.position) {
      const decisionMakerTitles = ['ceo', 'cto', 'cio', 'director', 'vp', 'head', 'manager'];
      if (decisionMakerTitles.some(title => 
        lead.position?.toLowerCase().includes(title)
      )) {
        score += 20;
      }
    }

    // Contact information completeness
    if (lead.email) score += 5;
    if (lead.phone) score += 5;

    return Math.min(score, 40); // Cap at 40 points
  }

  calculateBehavioralScore(lead: Lead): number {
    let score = 0;

    // Source scoring
    const sourceScores: Record<string, number> = {
      'referral': 30,
      'website': 20,
      'event': 25,
      'email': 15,
      'social': 10,
      'advertisement': 10,
      'other': 5
    };
    score += sourceScores[lead.source] || 0;

    // Recent contact bonus
    if (lead.lastContactDate) {
      const daysSinceContact = Math.floor(
        (new Date().getTime() - lead.lastContactDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceContact < 7) score += 10;
      else if (daysSinceContact < 30) score += 5;
    }

    return Math.min(score, 40); // Cap at 40 points
  }

  calculateEngagementScore(lead: Lead): number {
    let score = 0;

    // Status-based scoring
    const statusScores: Record<string, number> = {
      'new': 5,
      'contacted': 10,
      'qualified': 15,
      'converted': 20,
      'unqualified': 0,
      'lost': 0
    };
    score += statusScores[lead.status] || 0;

    // Notes presence indicates engagement
    if (lead.notes.length > 0) score += 5;

    // Tag-based scoring
    const highValueTags = ['hot', 'priority', 'interested'];
    lead.tags.forEach(tag => {
      if (highValueTags.includes(tag.toLowerCase())) score += 5;
    });

    return Math.min(score, 20); // Cap at 20 points
  }

  calculateTotalScore(lead: Lead): LeadScore {
    const demographic = this.calculateDemographicScore(lead);
    const behavioral = this.calculateBehavioralScore(lead);
    const engagement = this.calculateEngagementScore(lead);

    return {
      demographic,
      behavioral,
      engagement,
      total: demographic + behavioral + engagement
    };
  }
}