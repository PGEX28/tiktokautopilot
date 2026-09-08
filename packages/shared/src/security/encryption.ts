import crypto from 'crypto';
import { logger } from '../logger/index.js';

export interface EncryptedPayload {
  encryptedData: string; // Hex
  iv: string; // Hex (12 or 16 bytes)
  tag: string; // Hex (16 bytes auth tag)
}

const ALGORITHM = 'aes-256-gcm';
const DEFAULT_KEY_FALLBACK = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function getEncryptionKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_KEY || DEFAULT_KEY_FALLBACK;
  // If key is provided as string, ensure 32 bytes (256 bits)
  if (hexKey.length === 64) {
    return Buffer.from(hexKey, 'hex');
  }
  return crypto.createHash('sha256').update(hexKey).digest();
}

/**
 * Criptografa dados em repouso utilizando AES-256-GCM com IV aleatório e Tag de autenticação
 */
export function encryptData(plainText: string, customKey?: Buffer): EncryptedPayload {
  try {
    const key = customKey || getEncryptionKey();
    const iv = crypto.randomBytes(16); // 128-bit IV
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  } catch (err) {
    logger.error('Error encrypting sensitive data', err);
    throw new Error('Falha na criptografia de dados sensíveis');
  }
}

/**
 * Decifra dados criptografados verificando a integridade da Tag de autenticação
 */
export function decryptData(payload: EncryptedPayload, customKey?: Buffer): string {
  try {
    const key = customKey || getEncryptionKey();
    const iv = Buffer.from(payload.iv, 'hex');
    const tag = Buffer.from(payload.tag, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(tag);

    let decrypted = decipher.update(payload.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    logger.warn('Failed to decrypt data: Invalid key, corrupted payload or altered authentication tag');
    throw new Error('Falha na decifragem: dados corrompidos ou chave inválida');
  }
}
