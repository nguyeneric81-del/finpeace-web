-- Fix: Seed missing sales agents into Supabase
-- Run tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql

INSERT INTO sales_agents (code, full_name, brand_name, brand_tagline, brand_color_primary, brand_color_accent, title, contact_phone, active)
VALUES
  (
    'thuy03',
    'Lê Thuỷ',
    'Lê Thuỷ Financial',
    'Tư vấn tài chính cá nhân hoá',
    '#1E3A5F',
    '#c4a67a',
    'Financial Advisor',
    '',
    true
  ),
  (
    'aduc02',
    'Anh Đức',
    'Anh Đức Capital',
    'Đồng hành đầu tư thông minh',
    '#1E3A5F',
    '#c4a67a',
    'Financial Advisor',
    '',
    true
  ),
  (
    'huyen04',
    'Minaviko',
    'Minaviko Advisory',
    'Korean-Vietnamese Financial Bridge',
    '#1E3A5F',
    '#c4a67a',
    'Senior Financial Advisor',
    '',
    true
  ),
  (
    'mduc05',
    'Minh Đức',
    'Minh Đức Wealth',
    'Hoạch định tài chính bền vững',
    '#1E3A5F',
    '#c4a67a',
    'Financial Advisor',
    '',
    true
  )
ON CONFLICT (code) DO NOTHING;
