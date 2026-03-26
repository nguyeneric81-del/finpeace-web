-- Phase 20: Thêm tính năng lưu trữ Design System (giao diện giao phó cho AI UI UX Pro Max) vào Landing Page
ALTER TABLE agent_landing_pages
ADD COLUMN IF NOT EXISTS design_system JSONB;
