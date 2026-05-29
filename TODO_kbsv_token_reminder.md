# TODO: KBSV Token Re-login Reminder Flow

> Created: 2026-04-24 | Priority: Medium | Sprint: AutoPilot Phase 2

## Vấn đề
KBSV Refresh Token hết hạn sau **~20 ngày** (`1,727,963 giây`).
Khi hết hạn → mọi API call đến KBSV fail → KH mất kết nối mà không biết lý do.

## Cần làm

### 1. Cron Job hàng ngày (check token sắp hết hạn)
```
/api/cron/kbsv-token-check  (trigger mỗi 24h)
   ↓
SELECT * FROM kbsv_tokens 
WHERE refresh_expires_at < now() + interval '3 days'
AND status = 'active'
   ↓
Gửi thông báo cho từng user
```

### 2. Kênh thông báo (theo thứ tự ưu tiên)
- [ ] **Push notification** (Web Push đã có `push_subscriptions` table)
- [ ] **Email** (Resend đã cấu hình)
- [ ] **Banner trong Dashboard** (UI warning)

### 3. Nội dung thông báo

| Thời điểm | Kênh | Nội dung |
|-----------|------|---------|
| Còn 5 ngày | Push + Email | "⚠️ Kết nối KBSV hết hạn sau 5 ngày. Nhấn để gia hạn." |
| Còn 3 ngày | Push + Banner vàng | "🔶 Vui lòng kết nối lại KBSV để AutoPilot tiếp tục hoạt động." |
| Còn 1 ngày | Push + Banner đỏ + Email | "🔴 Kết nối KBSV hết hạn ngày mai!" |
| Đã hết hạn | Modal bắt buộc | "❌ Kết nối KBSV đã hết hạn. Nhấn để đăng nhập lại." |

### 4. UI Components cần build
- [ ] `KBSVTokenWarningBanner` — hiển thị trong advisor dashboard
- [ ] Modal reconnect khi status = `expired`
- [ ] Badge trên "Kết nối KBSV" button

### 5. Database updates khi hết hạn
```sql
-- Cron job cũng update status
UPDATE kbsv_tokens 
SET status = 'expired'
WHERE refresh_expires_at < now()
AND status = 'active';
```

## Files liên quan
- `/src/app/api/kbsv/proxy/[endpoint]/route.ts` — đã có auto-refresh logic
- `/src/app/api/kbsv/callback/route.ts` — OAuth callback
- `public.kbsv_tokens` (Supabase) — `refresh_expires_at`, `status`

## Notes kỹ thuật
- `refresh_token` KBSV: `1,727,963s` = **19.99 ngày** (~20 ngày)
- Proxy route đã handle `status = 'expired'` → trả về 401
- Trigger reconnect bằng: `window.location.href = '/api/kbsv/auth?advisor_user_id=xxx'`
