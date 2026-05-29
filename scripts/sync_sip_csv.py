import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
import math
import sys

# Load environment variables
load_dotenv('.env.local')

url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase config missing.")
    exit(1)

supabase: Client = create_client(url, key)
file_path = '/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/SIP_ProcessingData - DealOrder.G.csv'

def clean_val(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return val

dry_run = '--execute' not in sys.argv

print(f"Loading CSV: {file_path}")
try:
    df = pd.read_csv(file_path)
    print(f"Total rows in CSV: {len(df)}")
    
    print("Fetching active profiles & plans from Supabase...")
    profiles_resp = supabase.table("profiles").select("id, email").execute()
    profile_map = {p['email'].lower(): p['id'] for p in profiles_resp.data if p.get('email')}
    
    plans_resp = supabase.table("sip_service_plans").select("id, user_id, stock_code").execute()
    
    print("Fetching existing transactions from Supabase...")
    tx_resp = supabase.table("sip_transactions").select("id, user_id, stock_code, order_date").execute()
    
    # Create composite keys from existing transactions
    existing_keys = set()
    for tx in tx_resp.data:
        # DB date format may be YYYY-MM-DD
        dt = str(tx['order_date']).split('T')[0] if tx['order_date'] else ''
        k = f"{tx['user_id']}_{tx['stock_code']}_{dt}"
        existing_keys.add(k)
        
    print(f"Found {len(existing_keys)} existing unique transactions in DB.")
        
    inserted_count = 0
    skipped_count = 0
    
    for idx, row in df.iterrows():
        email = str(clean_val(row.get('Email'))).strip().lower()
        stock_code = clean_val(row.get('MCK'))
        order_date_raw = clean_val(row.get('OrderDate'))
        
        if not email or email == 'nan' or not stock_code or not order_date_raw:
            continue
            
        user_id = profile_map.get(email)
        if not user_id:
            continue
            
        # Format date from DD/MM/YYYY to YYYY-MM-DD
        parts = str(order_date_raw).split('/')
        if len(parts) == 3:
            order_date = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
        else:
            # fallback if it's already YYYY-MM-DD
            order_date = str(order_date_raw).split(' ')[0]
            
        stock_code = str(stock_code).strip().upper()
        
        composite_key = f"{user_id}_{stock_code}_{order_date}"
        
        if composite_key in existing_keys:
            skipped_count += 1
            continue
            
        plan_id = next((p['id'] for p in plans_resp.data if p['user_id'] == user_id and p['stock_code'] == stock_code), None)
        
        # Check column names: CSV might have "Giá trị mua" and "Giá trị mua.1".
        unit = clean_val(row.get('Số lượng mua'))
        
        actual_val = clean_val(row.get('Giá trị mua.1'))
        if actual_val is None:
            actual_val = clean_val(row.get('Giá trị mua.2'))
        if actual_val is None:
            actual_val = clean_val(row.get('Giá trị mua')) # fallback
            
        if actual_val is not None:
            try: actual_val = float(str(actual_val).replace(',', ''))
            except: pass
            
        tx_data = {
            "user_id": user_id,
            "plan_id": plan_id,
            "order_date": order_date,
            "stock_code": stock_code,
            "unit": float(unit) if unit is not None else None,
            "total_value": float(actual_val) if actual_val is not None else None,
            "note": str(clean_val(row.get('Note'))) if clean_val(row.get('Note')) else None,
        }
        
        if not dry_run:
            try:
                supabase.table("sip_transactions").insert(tx_data).execute()
                inserted_count += 1
                existing_keys.add(composite_key) # Prevent duplicate within same CSV run
            except Exception as e:
                print(f"Failed to insert tx {email} {stock_code}: {e}")
        else:
            print(f"[DRY RUN] Will insert: {email} | {stock_code} | {order_date} | {actual_val}")
            inserted_count += 1
            existing_keys.add(composite_key)
            
    if dry_run:
        print(f"\n[DRY RUN] Finished. Would insert {inserted_count} new rows. Skipped {skipped_count} existing rows.")
        print("Run with '--execute' to actually insert into database.")
    else:
        print(f"\n✅ Execution Finished! Inserted {inserted_count} new rows. Skipped {skipped_count} existing rows.")

except Exception as e:
    print(f"Critical error: {e}")
