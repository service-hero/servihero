export interface ApiKey {
  id: string;
  key: string;
  name: string;
  accountId: string;
  permissions: string[];
  lastUsed?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyCreateRequest {
  name: string;
  permissions: string[];
  expiresAt?: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}