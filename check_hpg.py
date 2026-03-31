import os
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv('.env.local')

url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# Get user_id for hoatra2110@gmail.com
profiles = supabase.table("profiles").select("id").eq("email", "hoatra2110@gmail.com").execute()
if profiles.data:
    uid = profiles.data[0]['id']
    plans = supabase.table("sip_service_plans").select("*").eq("user_id", uid).execute()
    print("PLANS:")
    for p in plans.data:
        print(f"ID: {p['id']}, Stock: {p['stock_code']}, Status: {p['status']}, Start: {p['start_date']}, Dealer: {p['assigned_dealer']}, SecAcc: {p['securities_account']}")
else:
    print("User not found")
