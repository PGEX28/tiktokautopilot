import { config } from 'dotenv';
config();

import { createServer } from './server.js';
import { logger } from '@autopilot/shared';

const PORT = parseInt(process.env.PORT || '4000', 10);
const server = createServer();

server.listen(PORT, () => {
  logger.info(`🚀 TikTok Shop AI Autopilot API Server running on port ${PORT}`, {
    port: PORT,
    appEnv: process.env.APP_ENV || 'DEMO',
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});
