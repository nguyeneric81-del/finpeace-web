ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stockspick_credits integer DEFAULT 0;

CREATE TABLE IF NOT EXISTS user_unlocked_deals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    deal_id uuid REFERENCES trading_plans(id) ON DELETE CASCADE,
    unlocked_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, deal_id)
);

ALTER TABLE user_unlocked_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Xem deals mo khoa cua tao" ON user_unlocked_deals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Them deals mo khoa cua tao" ON user_unlocked_deals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
