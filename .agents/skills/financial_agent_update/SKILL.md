---
name: update_financial_data
description: "Kỹ năng này hoạt động như một REST Client để tự động đẩy số liệu tài chính của khách hàng (lấy từ tin nhắn chat) lên CSDL Supabase thông qua API nội bộ của FinPeace"
---

# Mục tiêu
Agent sẽ đóng vai trò như một chuyên viên nhập liệu tự động. Khi Phát hiện Người dùng báo cáo về dòng tiền, thu nhập hoặc chi phí của Khách hàng, Agent trích xuất thông tin đó và gửi Request tới Hệ thống FinPeace.

# Quy trình hoạt động
1. **Trích xuất thông tin (Extraction):** 
   - Khi Người dùng cung cấp thông tin, Agent cần tự động bóc tách các trường: (1) `Email khách hàng`, (2) `Hành động: update_cashflow | update_net_worth`, (3) `Số tiền (amount)`, (4) `Ghi chú (notes)`.
   - Lưu ý: Email là bắt buộc để tra cứu tài khoản khách truy cập hệ thống.
2. **Xác thực API Key:** 
   - Chuẩn bị API Secret Key: `finpeace-agent-secret-key-2025`
3. **Gửi Request:** 
   - Sử dụng tool `run_command` để kích hoạt cURL request POST tới endpoint: `http://localhost:3000/api/agent/update-financial-data` của hệ thống. 
   - Truyền tải định dạng JSON body. 

# Mẫu Câu Lệnh Sinh cURL (Template)
```bash
curl -X POST http://localhost:3000/api/agent/update-financial-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer finpeace-agent-secret-key-2025" \
  -d '{
    "email": "khachhang@email.com",
    "action": "update_cashflow",
    "data": {
      "amount": 20000000,
      "notes": "Lương tháng 10/2025"
    }
  }'
```

# Xử lý Kết quả
- Nếu cURL trả về `{"success": true}`, Agent trả lời Người dùng: "✅ Đã cập nhật thành công Số tiền ... cho anh/chị [Tên] vào Hệ Thống!"
- Nếu cURL báo lỗi (404/401/500), Agent báo lỗi cho Người dùng và ngừng thao tác nội bộ.
