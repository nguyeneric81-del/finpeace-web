---
name: update_financial_data
description: "Kỹ năng này hoạt động như một REST Client để tự động đẩy số liệu tài chính của khách hàng (lấy từ tin nhắn chat) lên CSDL Supabase thông qua API nội bộ của FinPeace"
---

# Mục tiêu
Agent sẽ đóng vai trò như một chuyên viên nhập liệu tự động. Khi Phát hiện Người dùng báo cáo về dòng tiền, thu nhập hoặc chi phí của Khách hàng, Agent trích xuất thông tin đó và gửi Request tới Hệ thống FinPeace.

# Quy trình hoạt động
1. **Trích xuất thông tin (Extraction):** 
   - Khi Khách hàng chia sẻ thông tin về nợ nần, dự phòng, tài sản, Agent tự động bóc tách và chọn `Hành động: update_financial_snapshot`.
   - Các trường trong Data cần thu thập đầy đủ bộ dữ kiện: (1) `total_debt` (Tổng dư nợ), (2) `emergency_fund` (Quỹ dự phòng), (3) `cashflow` (Dòng tiền), (4) `notes` (Ghi chú chẩn đoán nhanh).
   - Lưu ý: Email là bắt buộc để tra cứu tài khoản trên hệ thống.
2. **Xác thực API Key:** 
   - Chuẩn bị API Secret Key: `finpeace-agent-secret-key-2025`
3. **Gửi Request Cập Nhật Realtime (Đồng Bộ Kép):** 
   - Sử dụng tool `run_command` để kích hoạt cURL request POST tới endpoint: `http://localhost:3000/api/agent/update-financial-data` của hệ thống. 
   - Hành động này sẽ thay đổi Database, lập tức Bắn tia Realtime làm nhảy Giao Diện Khách hàng.

# Mẫu Câu Lệnh Sinh cURL (Template)
```bash
curl -X POST http://localhost:3000/api/agent/update-financial-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer finpeace-agent-secret-key-2025" \
  -d '{
    "email": "khachhang@email.com",
    "action": "update_financial_snapshot",
    "data": {
      "total_debt": 500000000,
      "emergency_fund": 15000000,
      "cashflow": 0,
      "notes": "Đã ghi nhận Nợ 500 triệu và quỹ dự phòng 15 triệu"
    }
  }'
```

# Xử lý Kết quả
- Nếu cURL trả về `{"success": true}`, Agent trả lời Người dùng: "✅ Đã cập nhật thành công Số tiền ... cho anh/chị [Tên] vào Hệ Thống!"
- Nếu cURL báo lỗi (404/401/500), Agent báo lỗi cho Người dùng và ngừng thao tác nội bộ.
