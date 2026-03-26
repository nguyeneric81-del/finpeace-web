const { Client } = require('pg');
const fs = require('fs');

async function main() {
  require('dotenv').config({ path: '.env.local' });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Không tìm thấy DATABASE_URL');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('🔗 Đã kết nối Supabase Postgres');

  console.log('🛠 Thêm cột design_system (JSONB)...');
  await client.query(`
    -- Add design_system pillar to agent_landing_pages
    ALTER TABLE agent_landing_pages
    ADD COLUMN IF NOT EXISTS design_system JSONB;
  `);

  console.log('✅ Hoàn tất bảo trì DB!');
  await client.end();
}

main().catch(err => console.error(err));
