export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isRetryable: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, isRetryable = false, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, false, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized or invalid token', details?: unknown) {
    super(message, 401, false, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id '${id}' not found` : `${resource} not found`, 404, false);
  }
}

export class BudgetExceededError extends AppError {
  constructor(message = 'Daily or monthly AI budget limit reached', details?: unknown) {
    super(message, 429, false, details);
  }
}

export class EmergencyStopError extends AppError {
  constructor(message = 'Emergency stop active. Operation blocked.') {
    super(message, 503, false);
  }
}

export class NotSupportedByProviderError extends AppError {
  constructor(providerName: string, feature: string) {
    super(`Feature '${feature}' is not supported by provider '${providerName}' or requires elevated API permissions`, 501, false);
  }
}

export class ExternalProviderError extends AppError {
  constructor(providerName: string, message: string, isRetryable = true, details?: unknown) {
    super(`Provider error [${providerName}]: ${message}`, 502, isRetryable, details);
  }
}

export class TikTokApiError extends ExternalProviderError {
  public readonly errorCode?: number;
  public readonly subCode?: string;

  constructor(message: string, errorCode?: number, subCode?: string, isRetryable = true) {
    super('TikTokShop', message, isRetryable, { errorCode, subCode });
    this.errorCode = errorCode;
    this.subCode = subCode;
  }
}
