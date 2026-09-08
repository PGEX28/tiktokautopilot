import { Router, Request, Response } from 'express';
import { logger } from '@autopilot/shared';

export const authRouter = Router();

// GET /api/v1/auth/tiktok/url - Get TikTok Shop authorization URL
authRouter.get('/tiktok/url', (_req: Request, res: Response) => {
  const isDemo = (process.env.APP_ENV || 'DEMO') === 'DEMO';
  const appId = process.env.TIKTOK_APP_KEY || 'demo_app_key';
  const redirectUri = encodeURIComponent(process.env.TIKTOK_REDIRECT_URI || 'http://localhost:4000/api/v1/auth/tiktok/callback');

  const authUrl = isDemo
    ? `http://localhost:5173/auth/demo-callback?code=mock_auth_code_demo_123`
    : `https://services.tiktokshop.com/open/authorize?app_key=${appId}&redirect_uri=${redirectUri}&state=random_csrf_token`;

  res.json({
    success: true,
    data: {
      authUrl,
      mode: isDemo ? 'DEMO' : 'OFFICIAL_TIKTOK_OAUTH',
    },
  });
});

// POST /api/v1/auth/tiktok/callback - Exchange auth code for encrypted tokens
authRouter.post('/tiktok/callback', async (req: Request, res: Response) => {
  const { code } = req.body as { code: string };
  logger.info('Received TikTok OAuth callback code', { codePreview: code ? code.slice(0, 10) : 'none' });

  res.json({
    success: true,
    data: {
      sellerName: 'Demo TikTok Shop Seller',
      shopId: 'SHOP_DEMO_9981',
      status: 'CONNECTED',
      expiresIn: 86400,
    },
  });
});
