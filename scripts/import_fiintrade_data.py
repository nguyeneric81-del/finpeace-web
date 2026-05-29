import os
import pandas as pd
import math
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
# Use service role key for admin operations to bypass RLS if needed
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: Missing Supabase credentials in .env.local")
    # You will need to provide them or ensure they are loaded

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print("Could not initialize Supabase client. Make sure supabase-py is installed.")
    supabase = None

def clean_value(val):
    """Làm sạch dữ liệu NaN hoặc inf của pandas để insert vào Supabase"""
    if pd.isna(val) or val == 'nan' or val == 'NaN':
        return None
    if isinstance(val, (int, float)) and math.isinf(val):
        return None
    return val

def import_fiintrade_data(file_path: str, year: int, quarter: int):
    print(f"Reading Excel file: {file_path}")
    
    # Đọc dữ liệu, bỏ qua các dòng không có dữ liệu (thường data bắt đầu từ dòng 11 - index 11)
    df = pd.read_excel(file_path, header=None)
    
    # Lấy các dòng từ index 11 trở đi
    data_df = df.iloc[11:].copy()
    
    print(f"Found {len(data_df)} rows of data. Processing...")
    
    success_count = 0
    error_count = 0
    
    for index, row in data_df.iterrows():
        ticker = clean_value(row[2])
        
        # Bỏ qua dòng trống hoặc không có mã CK
        if not ticker:
            continue
            
        name = clean_value(row[3])
        exchange = clean_value(row[4])
        industry = clean_value(row[5])
        
        # Chỉ số cơ bản
        market_cap = clean_value(row[8])
        pe_ttm = clean_value(row[20])
        pe_plan = clean_value(row[21])
        pb_ttm = clean_value(row[23])
        
        # Kết quả kinh doanh Q1-26
        net_revenue = clean_value(row[24])
        net_revenue_yoy = clean_value(row[30])
        
        profit_after_tax = clean_value(row[32])
        profit_plan_pct = clean_value(row[33])
        profit_after_tax_yoy = clean_value(row[38])
        
        npat_mi = clean_value(row[40])
        npat_mi_yoy = clean_value(row[46])
        
        report_type = clean_value(row[48])
        
        if not supabase:
            continue
            
        try:
            # 1. Upsert Company
            company_data = {
                "ticker": ticker,
                "name": name or ticker,
                "exchange": exchange,
                "industry": industry
            }
            # Upsert company to ensure it exists
            supabase.table('companies').upsert(company_data, on_conflict='ticker').execute()
            
            # Lưu 5 quý riêng biệt (Từ Q1-25 đến Q1-26) dựa trên chỉ số Index cột
            quarters_data = [
                # Q1-2025
                {"year": year - 1, "quarter": 1, "data": {"net_revenue_yoy": clean_value(row[26]), "profit_after_tax_yoy": clean_value(row[34]), "npat_mi_yoy": clean_value(row[42])}},
                # Q2-2025
                {"year": year - 1, "quarter": 2, "data": {"net_revenue_yoy": clean_value(row[27]), "profit_after_tax_yoy": clean_value(row[35]), "npat_mi_yoy": clean_value(row[43])}},
                # Q3-2025
                {"year": year - 1, "quarter": 3, "data": {"net_revenue_yoy": clean_value(row[28]), "profit_after_tax_yoy": clean_value(row[36]), "npat_mi_yoy": clean_value(row[44])}},
                # Q4-2025
                {"year": year - 1, "quarter": 4, "data": {"net_revenue_yoy": clean_value(row[29]), "profit_after_tax_yoy": clean_value(row[37]), "npat_mi_yoy": clean_value(row[45])}},
                # Q1-2026 (Quý hiện tại có đủ absolute values)
                {"year": year, "quarter": quarter, "data": {
                    "report_type": report_type,
                    "market_cap": market_cap,
                    "pe_ttm": pe_ttm, "pb_ttm": pb_ttm, "pe_plan": pe_plan,
                    "net_revenue": net_revenue, "net_revenue_yoy": net_revenue_yoy,
                    "profit_after_tax": profit_after_tax, "profit_after_tax_yoy": profit_after_tax_yoy, "profit_plan_pct": profit_plan_pct,
                    "npat_mi": npat_mi, "npat_mi_yoy": npat_mi_yoy
                }}
            ]
            
            for q in quarters_data:
                # Kiểm tra xem có dữ liệu hợp lệ nào không (Tránh insert dòng rỗng)
                if not any(v is not None for v in q["data"].values()):
                    continue
                    
                q_year = q["year"]
                q_quarter = q["quarter"]
                
                # Base payload
                report_payload = {
                    "ticker": ticker,
                    "year": q_year,
                    "quarter": q_quarter
                }
                report_payload.update(q["data"])
                
                existing = supabase.table('financial_quarterly_reports').select('id').eq('ticker', ticker).eq('year', q_year).eq('quarter', q_quarter).execute()
                if existing.data:
                    # Update (chỉ update các trường có value từ file, không đè NULL lên data cũ)
                    report_id = existing.data[0]['id']
                    update_data = {k: v for k, v in report_payload.items() if v is not None}
                    if update_data:
                        supabase.table('financial_quarterly_reports').update(update_data).eq('id', report_id).execute()
                else:
                    # Insert
                    supabase.table('financial_quarterly_reports').insert(report_payload).execute()
                
            success_count += 1
            if success_count % 50 == 0:
                print(f"Processed {success_count} records...")
                
        except Exception as e:
            print(f"Error processing ticker {ticker}: {str(e)}")
            error_count += 1
            
    print(f"\n--- IMPORT COMPLETE ---")
    print(f"Successfully processed: {success_count} companies")
    print(f"Errors: {error_count}")

if __name__ == "__main__":
    file_path = "/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/Finpeace/FiinTrade_Earnings_Update_Q1.2026_04.05.xlsx"
    year = 2026
    quarter = 1
    
    print("Starting FiinTrade Data Import...")
    # Thực thi import dữ liệu
    import_fiintrade_data(file_path, year, quarter)
    print("Script execution completed.")
