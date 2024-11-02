import { randomBytes, createHash } from 'crypto';

export async function generateSecureKey(): Promise<string> {
  // Generate 32 random bytes and convert to hex
  const randomKey = randomBytes(32).toString('hex');
  
  // Create a timestamp component
  const timestamp = Date.now().toString(36);
  
  // Combine and hash for final key
  const hash = createHash('sha256')
    .update(randomKey + timestamp)
    .digest('hex');
    
  // Format as a readable key
  return `sk_${hash.slice(0, 32)}`;
}

export function hashApiKey(key: string): string {
  return createHash('sha256')
    .update(key)
    .digest('hex');
}