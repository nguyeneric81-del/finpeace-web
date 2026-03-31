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
    print("Error: Supabase URL or Service Role Key missing in .env.local")
    exit(1)

supabase: Client = create_client(url, key)
file_path = '/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/SIP_ProcessingData (TA).xlsx'

def clean_val(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return val

try:
    xl = pd.ExcelFile(file_path)
    print("Excel file loaded. Starting migration...")

    # 1. Import sip_asset_valuations (from QuarterReport)
    if 'QuarterReport' in xl.sheet_names:
        print("\n--- Processing QuarterReport (Asset Valuations) ---")
        df_qr = xl.parse('QuarterReport')
        
        for idx, row in df_qr.iterrows():
            stock_code = clean_val(row.get('Mã'))
            if not stock_code: continue

            val_data = {
                "stock_code": stock_code,
                "update_date": str(clean_val(row.get('Update.Date'))).split(' ')[0] if clean_val(row.get('Update.Date')) else None,
                "quarter_update": str(clean_val(row.get('Quarter.Update'))),
                "old_intrinsic_value": clean_val(row.get('Giá trị nội tại cũ')),
                "new_intrinsic_value": clean_val(row.get('Giá trị nội tại mới')),
                "max_buy_price": clean_val(row.get('Giá tích sản tối đa')),
                "expected_growth": str(clean_val(row.get('Tăng trưởng kỳ vọng'))),
                "cta": str(clean_val(row.get('CTA'))),
                "business_outlook": str(clean_val(row.get('Nhận định về doanh nghiệp'))),
                "sip_outlook": str(clean_val(row.get('Nhận định về tích sản'))),
                "status": "Published"
            }

            try:
                # Upsert based on stock_code & quarter_update (you may need a unique index for true upsert)
                # For now just inserting
                supabase.table("sip_asset_valuations").insert(val_data).execute()
                print(f"Inserted valuation for {stock_code}")
            except Exception as e:
                print(f"Failed to insert valuation for {stock_code}: {e}")

    # 2. Extract Customer Emails from StockFollow.T and create plans
    if 'StockFollow.T' in xl.sheet_names:
        print("\n--- Processing StockFollow.T (SIP Plans) ---")
        df_plans = xl.parse('StockFollow.T')
        
        for idx, row in df_plans.iterrows():
            email = str(clean_val(row.get('Email'))).strip().lower()
            stock_code = clean_val(row.get('MCK'))
            if not email or email == 'nan' or not stock_code:
                continue

            # Fetch existing profiles
            existing_profiles = supabase.table("profiles").select("id, email").execute()
            profile_map = {p['email'].lower(): p['id'] for p in existing_profiles.data if p.get('email')}
                
            user_id = profile_map.get(email)

            if not user_id:
                print(f"Creating new Auth user for {email}...")
                try:
                    # Silently create the auth user
                    user_resp = supabase.auth.admin.create_user({
                        "email": email,
                        "password": "TempPassword123!A",
                        "email_confirm": True
                    })
                    user_id = user_resp.user.id
                except Exception as create_err:
                    print(f"Failed to create Auth account for {email}: {create_err}")
                    continue

            plan_data = {
                "user_id": user_id,
                "stock_code": stock_code.strip().upper(),
                "start_date": str(clean_val(row.get('Add'))).split(' ')[0] if clean_val(row.get('Add')) else None,
                "end_date": str(clean_val(row.get('Cancel'))).split(' ')[0] if clean_val(row.get('Cancel')) else None,
                "securities_company": str(clean_val(row.get('S_Company'))),
                "securities_account": str(clean_val(row.get('S_Account'))),
                "assigned_dealer": str(clean_val(row.get('Dealer'))),
                "status": "Active" if clean_val(row.get('Status')) != "Expired" else "Closed"
            }

            try:
                # Upsert / insert the service plan mapping for the stock code
                supabase.table("sip_service_plans").insert(plan_data).execute()
                print(f"Inserted SIP Service Plan for {email} -> {stock_code}")
            except Exception as e:
                print(f"Failed to insert plan for {email} ({stock_code}): {e}")

    print("\nData migration script finished successfully.")

except Exception as e:
    print(f"Failed to process file: {e}")
