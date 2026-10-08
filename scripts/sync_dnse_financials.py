import os
import sys
import time
import math
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from vnstock import Vnstock

# Load environment variables from finpeace-web/.env.local or .env.local
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

def clean_val(val):
    """Clean NaN, Inf, None into integer, float or None."""
    if val is None:
        return None
    if isinstance(val, (float, int)):
        if math.isnan(val) or math.isinf(val):
            return None
        return float(val)
    return val

def clean_bigint(val):
    """Convert float value from vnstock to int/bigint if possible."""
    cv = clean_val(val)
    if cv is None:
        return None
    try:
        return int(round(cv))
    except:
        return None

def sync_report_type(stock_obj, ticker: str, report_type: str, table_name: str, period: str = 'quarter'):
    """
    Fetch financial report from vnstock (VCI source) and upsert into Supabase table.
    report_type: 'income_statement', 'balance_sheet', 'cash_flow'
    """
    print(f"📊 Đang lấy {report_type} cho [{ticker}] ({period})...")
    try:
        if report_type == 'income_statement':
            df = stock_obj.finance.income_statement(period=period)
        elif report_type == 'balance_sheet':
            df = stock_obj.finance.balance_sheet(period=period)
        elif report_type == 'cash_flow':
            df = stock_obj.finance.cash_flow(period=period)
        else:
            return

        if df is None or df.empty:
            print(f"⚠️ Không có dữ liệu {report_type} cho {ticker}")
            return

        ignored_cols = {'item', 'item_en', 'item_id'}
        period_cols = [c for c in df.columns if c not in ignored_cols and ('-Q' in str(c) or str(c).isdigit())]

        records = []
        for p_col in period_cols:
            if '-Q' in str(p_col):
                parts = str(p_col).split('-Q')
                year = int(parts[0])
                prd = f"Q{parts[1]}"
            else:
                year = int(p_col)
                prd = 'YEAR'

            # Build full dynamic dictionary of all line items
            details_dict = {}
            for _, row in df.iterrows():
                item_name = str(row['item']).strip()
                val = clean_val(row[p_col])
                if val is not None:
                    details_dict[item_name] = val

            record = {
                "ticker": ticker,
                "period": prd,
                "year": year,
                "details": details_dict
            }

            # Map standard columns if available
            if table_name == 'income_statements':
                record['revenue'] = clean_bigint(details_dict.get('Doanh thu bán hàng và cung cấp dịch vụ') or details_dict.get('DOANH THU HOẠT ĐỘNG') or details_dict.get('Thu nhập lãi thuần'))
                record['net_revenue'] = clean_bigint(details_dict.get('Doanh thu thuần') or details_dict.get('Thu nhập lãi thuần') or details_dict.get('Doanh thu thuần về hoạt động kinh doanh'))
                record['gross_profit'] = clean_bigint(details_dict.get('Lợi nhuận gộp') or details_dict.get('Lãi/lỗ thuần'))
                record['net_profit_after_tax'] = clean_bigint(details_dict.get('Lợi nhuận sau thuế thu nhập doanh nghiệp') or details_dict.get('Tổng lợi nhuận sau thuế') or details_dict.get('Lãi/(lỗ) thuần sau thuế'))
                record['profit_before_tax'] = clean_bigint(details_dict.get('Tổng lợi nhuận kế toán trước thuế') or details_dict.get('Tổng lợi nhuận/lỗ trước thuế') or details_dict.get('Lãi/(lỗ) trước thuế'))

            elif table_name == 'balance_sheets':
                record['total_assets'] = clean_bigint(details_dict.get('TỔNG CỘNG TÀI SẢN') or details_dict.get('Tổng tài sản') or details_dict.get('TÀI SẢN'))
                record['short_term_assets'] = clean_bigint(details_dict.get('TÀI SẢN NGẮN HẠN') or details_dict.get('Tài sản ngắn hạn'))
                record['long_term_assets'] = clean_bigint(details_dict.get('TÀI SẢN DÀI HẠN') or details_dict.get('Tài sản dài hạn'))
                record['total_liabilities'] = clean_bigint(details_dict.get('NỢ PHẢI TRẢ') or details_dict.get('Nợ phải trả'))
                record['equity'] = clean_bigint(details_dict.get('VỐN CHỦ SỞ HỮU') or details_dict.get('Vốn chủ sở hữu'))

            elif table_name == 'cash_flows':
                record['cf_operating'] = clean_bigint(details_dict.get('Lưu chuyển tiền thuần từ hoạt động kinh doanh'))
                record['cf_investing'] = clean_bigint(details_dict.get('Lưu chuyển tiền thuần từ hoạt động đầu tư'))
                record['cf_financing'] = clean_bigint(details_dict.get('Lưu chuyển tiền thuần từ hoạt động tài chính'))
                record['net_cash_flow'] = clean_bigint(details_dict.get('Lưu chuyển tiền thuần trong kỳ'))

            records.append(record)

        if records:
            res = supabase.table(table_name).upsert(records, on_conflict="ticker,period,year").execute()
            print(f"  ✅ Đã lưu {len(records)} kỳ vào [{table_name}] cho {ticker}")

    except Exception as e:
        print(f"  ❌ Lỗi khi đồng bộ {report_type} cho {ticker}: {e}")

def sync_ticker_all_reports(ticker: str):
    print(f"\n==================== SYNCING {ticker} ====================")
    try:
        # Ensure ticker exists in companies table
        supabase.table("companies").upsert({"ticker": ticker, "name": ticker}).execute()
        
        stock = Vnstock().stock(symbol=ticker, source='VCI')
        sync_report_type(stock, ticker, 'income_statement', 'income_statements', period='quarter')
        sync_report_type(stock, ticker, 'balance_sheet', 'balance_sheets', period='quarter')
        sync_report_type(stock, ticker, 'cash_flow', 'cash_flows', period='quarter')
    except Exception as e:
        print(f"❌ Lỗi tổng quát cho {ticker}: {e}")

if __name__ == "__main__":
    # Test batch with 4 diverse sectors: HPG (Steel/Mfg), TCB (Bank), SSI (Securities), BVH (Insurance)
    symbols = ["HPG", "TCB", "SSI", "BVH"]
    print(f"🚀 BẮT ĐẦU ĐỒNG BỘ DỮ LIỆU BCTC (ĐA NGÀNH: SẢN XUẤT, BANK, CHỨNG KHOÁN, BẢO HIỂM)")
    for s in symbols:
        sync_ticker_all_reports(s)
        time.sleep(1)
    print("\n🎉🎉🎉 ĐÃ HOÀN TẤT ĐỒNG BỘ MẪU LÊN SUPABASE!")
