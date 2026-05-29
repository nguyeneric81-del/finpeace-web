import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase config missing.")
    exit(1)

supabase: Client = create_client(url, key)

print("Fetching profiles...")
profiles_resp = supabase.table("profiles").select("id, email, full_name").execute()
profile_map = {p['id']: p for p in profiles_resp.data}

print("Loading original CSV for Subscriber names...")
csv_path = '/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/SIP_ProcessingData - DealOrder.G.csv'
df_csv = pd.read_csv(csv_path)

subscriber_map = {}
for _, row in df_csv.iterrows():
    email = str(row.get('Email')).strip().lower()
    subscriber = str(row.get('subscribers')).strip()
    if email and email != 'nan' and subscriber and subscriber != 'nan' and subscriber != 'None':
        if email not in subscriber_map:
            subscriber_map[email] = subscriber

print("Fetching sip_service_plans...")
plans_resp = supabase.table("sip_service_plans").select("user_id, stock_code, securities_company").execute()
plan_map = {(p['user_id'], p['stock_code']): p.get('securities_company', '') for p in plans_resp.data}

print("Fetching sip_transactions...")
tx_resp = supabase.table("sip_transactions").select("*").execute()
df_tx = pd.DataFrame(tx_resp.data)

results = []

for (user_id, stock_code), group in df_tx.groupby(['user_id', 'stock_code']):
    # Convert 'unit' to numeric, forcing errors to 0 if any
    group['unit'] = pd.to_numeric(group['unit'], errors='coerce').fillna(0)
    total_unit = group['unit'].sum()
        
    p_info = profile_map.get(user_id, {})
    email_val = p_info.get("email", "")
    compare_email = email_val.lower().strip()
    
    company = plan_map.get((user_id, stock_code), "")
    
    # Use Subscriber name from CSV if available, else fallback to full_name in profile
    customer_name = subscriber_map.get(compare_email)
    if not customer_name or customer_name == 'None':
        full_name_db = p_info.get("full_name")
        customer_name = full_name_db if full_name_db else ""
    
    results.append({
        "Công ty Chứng khoán": company,
        "Email Khách Hàng": email_val,
        "Tên Khách Hàng": customer_name,
        "Mã SIP": stock_code,
        "Tổng Khối Lượng (Unit)": round(total_unit, 2)
    })

results_df = pd.DataFrame(results)
export_path = 'sip_validation_report.csv'
results_df.to_csv(export_path, index=False, encoding='utf-8-sig') # utf-8-sig to display Vietnamese correctly in Excel
print(f"\n=> Đã xuất báo cáo ra file: {os.path.abspath(export_path)}")
