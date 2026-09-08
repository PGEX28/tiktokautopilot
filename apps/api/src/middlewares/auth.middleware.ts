import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AppError } from '@autopilot/shared';

export type UserRole = 'ADMIN' | 'USER' | 'OPERATOR';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware para validar token Bearer ou chave de serviço
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Em modo DEMO, injeta usuário padrão se nenhum token for enviado
  if ((process.env.APP_ENV || 'DEMO') === 'DEMO' && !authHeader) {
    req.user = {
      id: 'demo_user_001',
      email: 'admin@tiktokautopilot.io',
      role: 'ADMIN',
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Token de autenticação ausente ou inválido no formato Bearer'));
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (token === 'mock_invalid_token' || token.length < 5) {
    return next(new AuthenticationError('Token expirado ou revogado'));
  }

  // Token válido (simulado ou JWT)
  req.user = {
    id: 'user_authenticated_01',
    email: 'operator@tiktokautopilot.io',
    role: token.includes('admin') ? 'ADMIN' : 'OPERATOR',
  };

  next();
}

/**
 * Middleware para restrição por cargo / permissão (RBAC)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Autenticação necessária'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(`Acesso negado: Perfil ${req.user.role} não possui permissão para esta operação`, 403));
    }

    next();
  };
}
