import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../services/api/ApiKeyService';

export async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: {
        code: 'unauthorized',
        message: 'API key is required'
      }
    });
  }

  try {
    const validKey = await ApiKeyService.validateApiKey(apiKey);
    
    if (!validKey) {
      return res.status(401).json({
        error: {
          code: 'invalid_api_key',
          message: 'Invalid or expired API key'
        }
      });
    }

    // Add API key info to request for later use
    req.apiKey = validKey;
    next();
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Failed to validate API key'
      }
    });
  }
}