import type { Lead } from '../../types/leads';

interface AttributionData {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage: string;
  referrer?: string;
  timestamp: Date;
}

export class LeadAttributionService {
  private static readonly STORAGE_KEY = 'lead_attribution_data';

  static trackPageView(): void {
    const attributionData = this.getAttributionData();
    const stored = this.getStoredData();
    
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([attributionData]));
    } else {
      stored.push(attributionData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    }
  }

  static getAttributionData(): AttributionData {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;

    return {
      source: urlParams.get('utm_source') || this.getReferrerSource(referrer),
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      content: urlParams.get('utm_content') || undefined,
      term: urlParams.get('utm_term') || undefined,
      landingPage: window.location.pathname,
      referrer: referrer || undefined,
      timestamp: new Date(),
    };
  }

  private static getReferrerSource(referrer: string): string {
    if (!referrer) return 'direct';
    
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    if (hostname.includes('google')) return 'google';
    if (hostname.includes('facebook')) return 'facebook';
    if (hostname.includes('linkedin')) return 'linkedin';
    if (hostname.includes('twitter')) return 'twitter';
    if (hostname.includes('bing')) return 'bing';
    
    return 'referral';
  }

  private static getStoredData(): AttributionData[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static getLeadAttribution(lead: Lead): AttributionData[] {
    return this.getStoredData() || [];
  }
}</content>