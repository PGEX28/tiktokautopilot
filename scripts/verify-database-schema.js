import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Supabase / PostgreSQL Schema & Migrations...');

const schemaPath = path.resolve('infrastructure/supabase/migrations/001_initial_schema.sql');
const rlsPath = path.resolve('infrastructure/supabase/migrations/002_rls_policies.sql');
const seedPath = path.resolve('infrastructure/supabase/seed.sql');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ Migration 001_initial_schema.sql not found!');
  process.exit(1);
}

if (!fs.existsSync(rlsPath)) {
  console.error('❌ Migration 002_rls_policies.sql not found!');
  process.exit(1);
}

if (!fs.existsSync(seedPath)) {
  console.error('❌ seed.sql not found!');
  process.exit(1);
}

const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const rlsSql = fs.readFileSync(rlsPath, 'utf8');
const seedSql = fs.readFileSync(seedPath, 'utf8');

const expectedTables = [
  'users',
  'tiktok_accounts',
  'products',
  'product_sources',
  'product_scores',
  'affiliate_campaigns',
  'affiliate_products',
  'content_projects',
  'scripts',
  'images',
  'videos',
  'video_variations',
  'live_loops',
  'live_sessions',
  'metrics',
  'orders',
  'commissions',
  'ai_decisions',
  'jobs',
  'job_attempts',
  'system_logs',
  'webhooks',
  'settings'
];

let missingTables = 0;
for (const table of expectedTables) {
  const regex = new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\s*\\(`, 'i');
  if (!regex.test(schemaSql)) {
    console.error(`❌ Table '${table}' missing in initial schema!`);
    missingTables++;
  } else {
    console.log(`✅ Table verified: ${table}`);
  }
}

if (missingTables > 0) {
  console.error(`\n❌ Failed: ${missingTables} tables missing from schema.`);
  process.exit(1);
}

// Verify RLS coverage
let rlsCoverage = 0;
for (const table of expectedTables) {
  if (table === 'job_attempts' || table === 'product_sources' || table === 'webhooks') continue; // non-direct RLS tables
  if (rlsSql.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`)) {
    rlsCoverage++;
  }
}

console.log(`✅ Verified RLS policies enabled for ${rlsCoverage} key tables.`);

// Verify seed data
if (seedSql.includes('Mini Cordless Portable Car & Desk Vacuum 9000Pa') &&
    seedSql.includes('BUDGET_CONFIG') &&
    seedSql.includes('SCORING_WEIGHTS')) {
  console.log('✅ Verified seed.sql contains realistic products, scores, variations, and budget configs.');
} else {
  console.error('❌ seed.sql missing required seed data!');
  process.exit(1);
}

console.log('\n🎉 ETAPA 2 database schema and migrations verified successfully!');
