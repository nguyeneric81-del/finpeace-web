import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
import math

# Load environment variables
load_dotenv('.env.local')

url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase config missing.")
    exit(1)

supabase: Client = create_client(url, key)
file_path = '/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/SIP_ProcessingData (TA).xlsx'

def clean_val(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return val

try:
    xl = pd.ExcelFile(file_path)
    print("Excel loaded. Starting Phase 2 Migration (Transactions & Performance)...")

    # 1. Fetch profiles and plans mapped in DB
    print("Fetching active profiles & plans from Supabase...")
    profiles_resp = supabase.table("profiles").select("id, email").execute()
    profile_map = {p['email'].lower(): p['id'] for p in profiles_resp.data if p.get('email')}
    
    plans_resp = supabase.table("sip_service_plans").select("id, user_id, stock_code, start_date").execute()
    
    # 2. Process DealOrder.G (Transactions)
    if 'DealOrder.G' in xl.sheet_names:
        print("\n--- Processing DealOrder.G (SIP Transactions) ---")
        df_order = xl.parse('DealOrder.G')
        
        tx_count = 0
        for idx, row in df_order.iterrows():
            email = str(clean_val(row.get('Email'))).strip().lower()
            stock_code = clean_val(row.get('MCK'))
            order_date = clean_val(row.get('OrderDate'))
            
            if not email or email == 'nan' or not stock_code or not order_date:
                continue
                
            user_id = profile_map.get(email)
            if not user_id: continue
            
            # Find matching plan_id
            plan_id = next((p['id'] for p in plans_resp.data if p['user_id'] == user_id and p['stock_code'] == stock_code), None)
            
            # Use 'Số lượng mua' and 'Giá trị mua.1' (assuming this is actual value) or fallback to 'Giá trị mua'
            unit = clean_val(row.get('Số lượng mua'))
            total_val = clean_val(row.get('Giá trị mua.1')) or clean_val(row.get('Giá trị mua'))
            if total_val is not None:
                try: total_val = float(str(total_val).replace(',', ''))
                except: pass
                
            tx_data = {
                "user_id": user_id,
                "plan_id": plan_id,
                "order_date": str(order_date).split(' ')[0],
                "stock_code": str(stock_code).strip().upper(),
                "unit": float(unit) if unit is not None else None,
                "total_value": float(total_val) if total_val is not None else None,
                "note": str(clean_val(row.get('Note'))) if clean_val(row.get('Note')) else None,
            }
            
            try:
                supabase.table("sip_transactions").insert(tx_data).execute()
                tx_count += 1
            except Exception as e:
                print(f"Failed to insert tx {email} {stock_code}: {e}")
                
        print(f"✅ Successfully inserted {tx_count} transactions.")

    # 3. Process SIPData into Performance Snapshots per user
    if 'SIPData' in xl.sheet_names:
        print("\n--- Processing SIPData (Performance Mapping) ---")
        df_sipdata = xl.parse('SIPData')
        
        # Load all rows of SIPData into memory structures roughly keyed by stock_code
        perf_data_by_stock = {}
        for idx, row in df_sipdata.iterrows():
            sc = clean_val(row.get('MCK'))
            if not sc: continue
            sc = str(sc).strip().upper()
            
            if sc not in perf_data_by_stock:
                perf_data_by_stock[sc] = []
                
            # Fallbacks for columns naming variants
            sip_acc = clean_val(row.get('SIPAcc.1')) or clean_val(row.get('SIPAcc')) or 0.0
            vn_acc = clean_val(row.get('VNIndexACc')) or clean_val(row.get('VNIndexAcc')) or 0.0
            
            perf_data_by_stock[sc].append({
                "month": str(clean_val(row.get('Month'))),
                "stock_code": sc,
                "cumulative_nav": float(clean_val(row.get('NAVN')) or 0.0),
                "sip_return_pct": float(sip_acc),
                "vnindex_return_pct": float(vn_acc),
            })
            
        snap_count = 0
        # Now apply the baseline metric for every plan mapped to users
        for plan in plans_resp.data:
            user_id = plan['user_id']
            sc = (plan.get('stock_code') or '').strip().upper()
            if not sc: continue
            
            # get target metrics for this stock
            metrics = perf_data_by_stock.get(sc, [])
            for m in metrics:
                snap_payload = {
                    "user_id": user_id,
                    "month": m['month'],
                    "stock_code": sc,
                    "cumulative_nav": m['cumulative_nav'],
                    "sip_return_pct": m['sip_return_pct'],
                    "vnindex_return_pct": m['vnindex_return_pct']
                }
                try:
                    supabase.table("sip_performance_snapshots").insert(snap_payload).execute()
                    snap_count += 1
                except Exception as e:
                    print(f"Snap fail {user_id} {sc} {m['month']}: {e}")
                    
        print(f"✅ Successfully inserted {snap_count} performance snapshots.")

    print("\nPhase 2 Complete!")

except Exception as e:
    print(f"Critical error: {e}")
