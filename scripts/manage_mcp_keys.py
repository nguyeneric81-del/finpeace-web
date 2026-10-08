import os
import sys
import secrets
import argparse
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

env_path = os.path.join(os.path.dirname(__file__), '../.env.local')
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Lỗi: Không tìm thấy SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_key_prefix():
    return f"fp_mcp_{secrets.token_urlsafe(24)}"

def create_key(email: str, name: str, role: str = 'analyst', days: int = None):
    new_key = generate_key_prefix()
    expires_at = None
    if days:
        expires_at = (datetime.utcnow() + timedelta(days=days)).isoformat()

    record = {
        "user_email": email.strip().lower(),
        "user_name": name.strip(),
        "api_key": new_key,
        "role": role,
        "is_active": True,
        "expires_at": expires_at
    }

    res = supabase.table("mcp_api_keys").insert(record).execute()
    if res.data:
        print("\n🎉 ĐÃ CẤP KHÓA MCP THÀNH CÔNG CHO NHÂN VIÊN!")
        print(f"👤 Nhân viên : {name} ({email})")
        print(f"🔑 Quyền hạn  : {role}")
        print(f"⏳ Hạn dùng   : {f'{days} ngày' if days else 'Vĩnh viễn'}")
        print(f"👉 API KEY    : {new_key}")
        print("\n📋 Hãy gửi API Key trên kèm URL máy chủ cho nhân viên.")
    else:
        print("❌ Lỗi khi tạo key trên Supabase")

def list_keys():
    res = supabase.table("mcp_api_keys").select("*").order("created_at", desc=True).execute()
    data = res.data or []
    print(f"\n📋 DANH SÁCH KHÓA MCP NHÂN VIÊN ({len(data)} khóa):\n")
    print(f"{'Tên':<20} | {'Email':<25} | {'Vai trò':<10} | {'Trạng thái':<10} | {'Lần dùng cuối':<20} | {'API Key'}")
    print("-" * 120)
    for r in data:
        status = "🟢 Hoạt động" if r.get('is_active') else "🔴 Đã khóa"
        last_used = r.get('last_used_at')[:19].replace('T', ' ') if r.get('last_used_at') else "Chưa dùng"
        print(f"{r.get('user_name', ''):<20} | {r.get('user_email', ''):<25} | {r.get('role', ''):<10} | {status:<10} | {last_used:<20} | {r.get('api_key')}")

def revoke_key(key_or_email: str):
    # Try updating by api_key or email
    res1 = supabase.table("mcp_api_keys").update({ "is_active": False }).eq("api_key", key_or_email).execute()
    if not res1.data:
        res1 = supabase.table("mcp_api_keys").update({ "is_active": False }).eq("user_email", key_or_email.lower()).execute()
    
    if res1.data:
        print(f"🔒 Đã thu hồi (Revoke) thành công quyền truy cập của: {key_or_email}")
    else:
        print(f"❌ Không tìm thấy khóa nào khớp với: {key_or_email}")

def main():
    parser = argparse.ArgumentParser(description="FinPeace MCP API Key Management")
    subparsers = parser.add_subparsers(dest="command", help="Lệnh thực thi")

    # Command: create
    create_parser = subparsers.add_parser("create", help="Cấp key mới cho nhân viên")
    create_parser.add_argument("--email", required=True, help="Email nhân viên")
    create_parser.add_argument("--name", required=True, help="Tên nhân viên")
    create_parser.add_argument("--role", default="analyst", choices=["analyst", "advisor", "admin"], help="Vai trò")
    create_parser.add_argument("--days", type=int, default=None, help="Số ngày hết hạn (tùy chọn)")

    # Command: list
    subparsers.add_parser("list", help="Xem danh sách tất cả các key")

    # Command: revoke
    revoke_parser = subparsers.add_parser("revoke", help="Khóa / Thu hồi key của nhân viên")
    revoke_parser.add_argument("--key", required=True, help="API Key hoặc Email cần khóa")

    args = parser.parse_args()

    if args.command == "create":
        create_key(args.email, args.name, args.role, args.days)
    elif args.command == "list":
        list_keys()
    elif args.command == "revoke":
        revoke_key(args.key)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
