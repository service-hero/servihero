import { CrmApiService, MarketingApiService } from '../services/api';
import { API_CONFIG } from '../config/api';

export function initializeApiServices(): void {
  // Initialize CRM API
  CrmApiService.initialize(
    API_CONFIG.crm.apiKey,
    API_CONFIG.crm.baseUrl
  );

  // Initialize Marketing API
  MarketingApiService.initialize(
    API_CONFIG.marketing.apiKey,
    API_CONFIG.marketing.baseUrl
  );
}