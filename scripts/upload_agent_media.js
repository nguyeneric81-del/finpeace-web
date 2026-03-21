#!/usr/bin/env node
/**
 * upload_agent_media.js
 * Script upload media cho Sales Agent từ Mac Mini → Supabase Storage
 *
 * Usage:
 *   node scripts/upload_agent_media.js --code dmd01 --avatar ./photos/duc.jpg
 *   node scripts/upload_agent_media.js --code dmd01 --youtube "VIDEO_ID" --bio "6 năm kinh nghiệm..."
 *   node scripts/upload_agent_media.js --code dmd01 --gallery ./photos/1.jpg ./photos/2.jpg
 *   node scripts/upload_agent_media.js --code dmd01 --facebook "https://fb.com/..." --tiktok "https://tiktok.com/@..."
 *
 * Requires: .env.local với NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// ── Load env ───────────────────────────────────────────────────────────────────
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Parse args ─────────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2)
  const result = { code: null, avatar: null, gallery: [], youtube: null, bio: null, facebook: null, tiktok: null, youtube_channel: null }
  let i = 0
  while (i < args.length) {
    switch (args[i]) {
      case '--code':     result.code    = args[++i]; break
      case '--avatar':   result.avatar  = args[++i]; break
      case '--youtube':  result.youtube = args[++i]; break
      case '--bio':      result.bio     = args[++i]; break
      case '--facebook': result.facebook = args[++i]; break
      case '--tiktok':   result.tiktok  = args[++i]; break
      case '--youtube-channel': result.youtube_channel = args[++i]; break
      case '--gallery':
        i++
        while (i < args.length && !args[i].startsWith('--')) {
          result.gallery.push(args[i++])
        }
        continue
    }
    i++
  }
  return result
}

// ── Upload file to Supabase Storage ───────────────────────────────────────────
async function uploadFile(localPath, storagePath, mimeType = 'image/jpeg') {
  const fileBuffer = fs.readFileSync(localPath)
  const { error } = await supabase.storage
    .from('avatars')
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,  // overwrite nếu đã tồn tại
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from('avatars').getPublicUrl(storagePath)
  return data.publicUrl
}

// ── Infer MIME from extension ──────────────────────────────────────────────────
function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }
  return map[ext] || 'image/jpeg'
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs()

  if (!opts.code) {
    console.error('❌ Cần truyền --code [agent_code]. VD: --code dmd01')
    process.exit(1)
  }

  console.log(`\n🚀 Bắt đầu cập nhật media cho Agent: ${opts.code}\n`)

  // Kiểm tra agent tồn tại
  const { data: agent, error: agentErr } = await supabase
    .from('sales_agents')
    .select('id, full_name, avatar_url')
    .eq('code', opts.code)
    .single()

  if (agentErr || !agent) {
    console.error(`❌ Agent "${opts.code}" không tồn tại trong DB`)
    process.exit(1)
  }

  console.log(`✅ Tìm thấy agent: ${agent.full_name} (${opts.code})`)

  const updates = {}

  // ── Avatar upload ────────────────────────────────────────────────────────────
  if (opts.avatar) {
    if (!fs.existsSync(opts.avatar)) {
      console.error(`❌ File avatar không tồn tại: ${opts.avatar}`)
      process.exit(1)
    }
    process.stdout.write(`📸 Uploading avatar: ${opts.avatar} ... `)
    const storagePath = `agents/${opts.code}/avatar.jpg`
    const publicUrl = await uploadFile(opts.avatar, storagePath, getMime(opts.avatar))
    updates.avatar_url = publicUrl
    console.log(`✅ ${publicUrl}`)
  }

  // ── Gallery upload ───────────────────────────────────────────────────────────
  if (opts.gallery.length > 0) {
    if (opts.gallery.length > 5) {
      console.warn('⚠️  Tối đa 5 ảnh gallery, chỉ upload 5 ảnh đầu.')
      opts.gallery = opts.gallery.slice(0, 5)
    }
    console.log(`🖼️  Uploading ${opts.gallery.length} gallery images...`)
    const galleryUrls = []
    for (let i = 0; i < opts.gallery.length; i++) {
      const localPath = opts.gallery[i]
      if (!fs.existsSync(localPath)) {
        console.warn(`  ⚠️  Bỏ qua: ${localPath} (không tồn tại)`)
        continue
      }
      const storagePath = `agents/${opts.code}/gallery_${i + 1}${path.extname(localPath)}`
      process.stdout.write(`  [${i + 1}] ${path.basename(localPath)} ... `)
      const url = await uploadFile(localPath, storagePath, getMime(localPath))
      galleryUrls.push(url)
      console.log('✅')
    }
    updates.gallery_urls = galleryUrls
  }

  // ── Text fields ──────────────────────────────────────────────────────────────
  if (opts.youtube)         updates.youtube_video_id = opts.youtube
  if (opts.bio)             updates.bio              = opts.bio
  if (opts.facebook)        updates.social_facebook  = opts.facebook
  if (opts.tiktok)          updates.social_tiktok    = opts.tiktok
  if (opts.youtube_channel) updates.social_youtube   = opts.youtube_channel

  // ── Update DB ────────────────────────────────────────────────────────────────
  if (Object.keys(updates).length === 0) {
    console.log('\n⚠️  Không có gì để cập nhật. Truyền ít nhất một trong: --avatar, --youtube, --bio, --gallery, --facebook, --tiktok')
    process.exit(0)
  }

  process.stdout.write('\n💾 Cập nhật database ... ')
  const { error: updateErr } = await supabase
    .from('sales_agents')
    .update(updates)
    .eq('code', opts.code)

  if (updateErr) {
    console.error(`\n❌ Lỗi update DB: ${updateErr.message}`)
    process.exit(1)
  }

  console.log('✅ Done!\n')
  console.log('─'.repeat(50))
  console.log('📋 Fields đã cập nhật:')
  Object.entries(updates).forEach(([k, v]) => {
    const display = Array.isArray(v) ? `[${v.length} items]` : String(v).slice(0, 80)
    console.log(`   ${k}: ${display}`)
  })
  console.log('─'.repeat(50))
  console.log(`\n🎉 Agent ${agent.full_name} (${opts.code}) đã được cập nhật thành công!\n`)
}

main().catch(err => {
  console.error('\n💥 Lỗi không xử lý được:', err.message)
  process.exit(1)
})
