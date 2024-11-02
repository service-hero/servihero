import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

export class ApiService {
  private static configs: Record<string, ApiConfig> = {};
  
  static setConfig(serviceName: string, config: ApiConfig): void {
    this.configs[serviceName] = config;
  }

  static async request<T>(
    serviceName: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config = this.configs[serviceName];
    if (!config) {
      throw new Error(`API configuration not found for service: ${serviceName}`);
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...config.headers,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Log API call to Firebase for monitoring
      await this.logApiCall(serviceName, {
        endpoint,
        method: options.method || 'GET',
        status: response.status,
        timestamp: new Date(),
      });

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`API call failed for ${serviceName}:`, error);
      
      // Log error to Firebase
      await this.logApiCall(serviceName, {
        endpoint,
        method: options.method || 'GET',
        status: 500,
        error: error.message,
        timestamp: new Date(),
      });

      return {
        data: null as T,
        status: 500,
        error: error.message,
      };
    }
  }

  private static async logApiCall(
    serviceName: string,
    logData: {
      endpoint: string;
      method: string;
      status: number;
      error?: string;
      timestamp: Date;
    }
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'apiLogs'), {
        serviceName,
        ...logData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to log API call:', error);
    }
  }
}