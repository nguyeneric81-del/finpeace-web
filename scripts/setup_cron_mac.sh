#!/bin/bash
# Script cài đặt Automated Macro Pipeline (chỉ cần chạy 1 lần)
# Usage: bash scripts/setup_cron_mac.sh

set -e

PLIST_NAME="com.finpeace.macro-pipeline"
PLIST_SRC="$(pwd)/com.finpeace.macro-pipeline.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"
LOG_DIR="$(pwd)/logs"

echo "🚀 Cài đặt FinPeace Macro Pipeline (Chạy mùng 1 hàng tháng)..."

# Tạo thư mục logs nếu chưa có
mkdir -p "$LOG_DIR"
echo "✅ Thư mục log: $LOG_DIR"

# Copy plist vào LaunchAgents
cp "$PLIST_SRC" "$PLIST_DEST"
echo "✅ Đã copy plist vào ~/Library/LaunchAgents/"

# Unload nếu đã tồn tại (tránh lỗi duplicate)
launchctl unload "$PLIST_DEST" 2>/dev/null || true

# Load LaunchAgent
launchctl load "$PLIST_DEST"
echo "✅ Đã đăng ký với macOS launchd!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 XONG! Pipeline sẽ tự chạy ngày mùng 1 hàng tháng lúc 6:00 SA"
echo ""
echo "📋 Các lệnh hữu ích:"
echo "  • Chạy ngay để test:  launchctl start $PLIST_NAME"
echo "  • Xem trạng thái:     launchctl list | grep finpeace"
echo "  • Xem log:            tail -f logs/launchd_out.log"
echo "  • Gỡ cài đặt:         launchctl unload $PLIST_DEST && rm $PLIST_DEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
