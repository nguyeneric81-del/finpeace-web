# Hướng Dẫn Sử Dụng & Quản Lý FinPeace Corporate MCP Server

FinPeace MCP Server cho phép nhân viên kết nối các ứng dụng AI (như **Claude Desktop, Cursor, Antigravity IDE, ChatGPT**) trực tiếp vào kho dữ liệu BCTC của FinPeace để tra cứu số liệu, so sánh cổ phiếu và khám sức khỏe doanh nghiệp bằng ngôn ngữ tự nhiên.

---

## I. DÀNH CHO QUẢN TRỊ VIÊN (ADMIN): CẤP VÀ THU HỒI TOKEN

Quản trị viên có thể quản lý danh sách nhân viên được cấp quyền thông qua công cụ dòng lệnh:

### 1. Cấp API Key mới cho nhân viên:
```bash
/Users/tuananhnguyen/workspace-gravity/.venv/bin/python finpeace-web/scripts/manage_mcp_keys.py create --name "Nguyễn Văn A" --email "vana@finpeace.vn" --role analyst --days 30
```
*(Nếu muốn cấp vĩnh viễn, bỏ qua tham số `--days`)*.

### 2. Xem danh sách tất cả các Key đang hoạt động:
```bash
/Users/tuananhnguyen/workspace-gravity/.venv/bin/python finpeace-web/scripts/manage_mcp_keys.py list
```

### 3. Thu hồi (Khóa) quyền của nhân viên ngay lập tức:
```bash
/Users/tuananhnguyen/workspace-gravity/.venv/bin/python finpeace-web/scripts/manage_mcp_keys.py revoke --key "vana@finpeace.vn"
```

---

## II. DÀNH CHO NHÂN VIÊN: HƯỚNG DẪN KẾT NỐI VÀO AI

Nhân viên chỉ cần lấy **API Key** do Quản trị viên cấp và kết nối theo 1 trong các cách sau:

### 1. Kết nối với Claude Desktop:
Mở file cấu hình `claude_desktop_config.json`:
* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Thêm cấu hình sau:
```json
{
  "mcpServers": {
    "finpeace-data": {
      "serverUrl": "https://finpeace.vn/api/mcp",
      "env": {
        "Authorization": "Bearer <DÁN_API_KEY_CỦA_BẠN_VÀO_ĐÂY>"
      }
    }
  }
}
```

### 2. Kết nối với Antigravity IDE / Cursor:
Tạo hoặc sửa file `.agents/mcp_config.json` trong dự án:
```json
{
  "mcpServers": {
    "finpeace-data": {
      "serverUrl": "https://finpeace.vn/api/mcp",
      "env": {
        "Authorization": "Bearer <DÁN_API_KEY_CỦA_BẠN_VÀO_ĐÂY>"
      }
    }
  }
}
```

---

## III. DANH SÁCH CÔNG CỤ (TOOLS) & CÂU HỎI MẪU (PROMPTS)

Sau khi kết nối, nhân viên chỉ cần chat tự nhiên với AI:

### 1. Tra cứu thông tin & Hồ sơ công ty:
> *"Cho tôi biết mã HPG niêm yết ở sàn nào, thuộc ngành gì và tên đầy đủ của doanh nghiệp?"*
👉 AI sẽ tự động gọi `company_get_profile(ticker='HPG')`.

### 2. Báo cáo Kết quả Kinh doanh:
> *"Tóm tắt doanh thu và lợi nhuận sau thuế của TCB trong 4 quý gần nhất?"*
👉 AI sẽ tự động gọi `financial_get_income_statement(ticker='TCB')`.

### 3. Bảng Cân đối kế toán & Chỉ số Ngân hàng:
> *"Kiểm tra Tổng tài sản, Dư nợ cho vay khách hàng và Tiền gửi khách hàng của Techcombank?"*
👉 AI sẽ tự động gọi `financial_get_balance_sheet(ticker='TCB')`.

### 4. So sánh các cổ phiếu cùng ngành:
> *"Hãy so sánh doanh thu và lợi nhuận 4 quý gần đây của 3 công ty thép HPG, NKG và HSG?"*
👉 AI sẽ tự động gọi `financial_compare_companies(tickers=['HPG', 'NKG', 'HSG'])`.

### 5. Tìm kiếm chỉ tiêu đặc thù trong BCTC:
> *"Tìm khoản mục 'Chi phí lãi vay' và 'Chi phí dự phòng rủi ro' của MBB?"*
👉 AI sẽ tự động gọi `financial_search_metric(ticker='MBB', metric_name='dự phòng')`.
