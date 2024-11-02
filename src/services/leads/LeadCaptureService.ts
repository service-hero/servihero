import type { Lead } from '../../types/leads';

export class LeadCaptureService {
  private static readonly REFERRAL_PARAMS = ['ref', 'referral', 'source'];
  private static readonly UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  static captureReferralData(): Partial<Lead> {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    // Check for referral parameters
    for (const param of this.REFERRAL_PARAMS) {
      const value = urlParams.get(param);
      if (value) {
        return {
          source: 'referral',
          notes: `Referred by: ${value}`
        };
      }
    }

    // Check for UTM parameters
    const utmParams: Record<string, string> = {};
    this.UTM_PARAMS.forEach(param => {
      const value = urlParams.get(param);
      if (value) utmParams[param] = value;
    });

    if (Object.keys(utmParams).length > 0) {
      return {
        source: utmParams.utm_source as Lead['source'] || 'other',
        notes: `Campaign: ${JSON.stringify(utmParams)}`
      };
    }

    // Check referrer
    if (referrer) {
      const referrerUrl = new URL(referrer);
      if (referrerUrl.hostname.includes('google')) return { source: 'organic' };
      if (referrerUrl.hostname.includes('facebook')) return { source: 'social' };
      if (referrerUrl.hostname.includes('linkedin')) return { source: 'social' };
      return { source: 'other', notes: `Referrer: ${referrerUrl.hostname}` };
    }

    return { source: 'direct' };
  }

  static async enrichLeadData(email: string): Promise<Partial<Lead>> {
    // In a real app, this would call a service like Clearbit or FullContact
    // For now, we'll return mock data
    return {
      company: 'Example Corp',
      position: 'Manager',
      tags: ['enriched']
    };
  }
}</content>