-- =====================================================
-- Phase 23: Fix StockPick Bronze Upgrade Bugs
-- =====================================================

-- 1. Cho phép Supabase Realtime theo dõi bảng payment_orders
-- Để client có thể nhận được event khi webhook cập nhật trạng thái 'paid'
ALTER PUBLICATION supabase_realtime ADD TABLE payment_orders;

-- 2. Drop RLS cũ vì StockPick auth là custom auth (không dùng Supabase Auth natively)
-- auth.uid() sẽ luôn trả về null đối với khách hàng StockPick, dẫn đến việc
-- Realtime sẽ bị block không trả về payload cho client.
DROP POLICY IF EXISTS "Users can view their own payment orders" ON payment_orders;

-- 3. Cho phép SELECT public vì mã UUID của payment order là đủ an toàn (không đoán được)
-- Hoặc đơn giản là tắt RLS trên bảng này do các tác vụ đều qua API Server-side
ALTER TABLE payment_orders DISABLE ROW LEVEL SECURITY;
