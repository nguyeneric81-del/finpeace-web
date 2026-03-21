#!/usr/bin/env node
/**
 * run_migration.js — Chạy migration SQL trực tiếp lên Supabase PostgreSQL
 *
 * Usage: node scripts/run_migration.js <db_password>
 *
 * Lấy DB password tại: Supabase Dashboard → Project Settings → Database → Password
 */

const { Client } = require('pg')
require('dotenv').config({ path: `.env.local` })

const password = process.argv[2]
if (!password) {
  console.error('❌ Cần truyền DB password. Usage:')
  console.error('   node scripts/run_migration.js YOUR_DB_PASSWORD')
  console.error('\n📍 Lấy password tại: Supabase Dashboard → Project Settings → Database → Database password')
  process.exit(1)
}

// Project ref lấy từ SUPABASE_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const projectRef  = supabaseUrl.replace('https://', '').split('.')[0]

const client = new Client({
  host:     `aws-0-ap-southeast-1.pooler.supabase.com`,
  port:     5432,
  database: 'postgres',
  user:     `postgres.${projectRef}`,
  password: password,
  ssl:      { rejectUnauthorized: false },
})

const SQL = `
-- Phase 15: Agent Media Columns
ALTER TABLE sales_agents
  ADD COLUMN IF NOT EXISTS youtube_video_id  TEXT,
  ADD COLUMN IF NOT EXISTS bio               TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls      TEXT[],
  ADD COLUMN IF NOT EXISTS social_facebook   TEXT,
  ADD COLUMN IF NOT EXISTS social_tiktok     TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube    TEXT;
`

async function run() {
  console.log(`\n🔌 Connecting to Supabase PostgreSQL (${projectRef})...`)
  try {
    await client.connect()
    console.log('✅ Connected!\n')

    console.log('⚡ Running migration phase15_agent_media...')
    await client.query(SQL)
    console.log('✅ Migration OK!\n')

    // Verify
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'sales_agents'
        AND column_name IN ('youtube_video_id','bio','gallery_urls','social_facebook','social_tiktok','social_youtube')
      ORDER BY column_name;
    `)

    if (result.rows.length === 0) {
      console.log('⚠️  Columns chưa thấy trong schema — thử lại sau vài giây.')
    } else {
      console.log('📋 Columns đã tồn tại trong sales_agents:')
      result.rows.forEach(r => console.log(`   ✓ ${r.column_name} (${r.data_type})`))
    }

    console.log('\n🎉 Migration phase15 hoàn tất! Giờ có thể dùng upload_agent_media.js\n')
  } catch (err) {
    if (err.message.includes('password authentication failed')) {
      console.error('❌ Sai DB password. Kiểm tra lại tại Supabase Dashboard → Project Settings → Database')
    } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
      console.error('❌ Không kết nối được. Thử host: db.' + projectRef + '.supabase.co port 5432')
    } else {
      console.error('❌ Lỗi:', err.message)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
