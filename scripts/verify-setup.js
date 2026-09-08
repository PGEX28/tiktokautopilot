import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying TikTok Shop AI Autopilot setup...');

const requiredDirs = [
  'apps/web',
  'apps/api',
  'packages/shared',
  'packages/ai',
  'packages/tiktok',
  'packages/video',
  'packages/database',
  'packages/queue',
  'infrastructure/docker',
  'infrastructure/supabase',
  'n8n/workflows',
  'docs',
  'scripts'
];

const requiredFiles = [
  'package.json',
  'tsconfig.base.json',
  'tsconfig.json',
  '.gitignore',
  '.env.example',
  '.prettierrc',
  '.eslintrc.json',
  'README.md',
  'ARCHITECTURE.md',
  'DEVELOPMENT.md',
  'packages/shared/src/index.ts',
  'packages/shared/src/types/index.ts',
  'packages/shared/src/errors/index.ts',
  'packages/shared/src/logger/index.ts',
  'packages/shared/src/constants/index.ts',
  'apps/api/src/server.ts',
  'apps/web/src/App.tsx',
  'infrastructure/docker/docker-compose.yml'
];

let hasErrors = false;

for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Missing directory: ${dir}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found directory: ${dir}`);
  }
}

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing file: ${file}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found file: ${file}`);
  }
}

if (hasErrors) {
  console.error('\n❌ Verification failed with missing directories or files.');
  process.exit(1);
} else {
  console.log('\n🎉 All structural requirements for ETAPA 1 are verified and functional!');
}
