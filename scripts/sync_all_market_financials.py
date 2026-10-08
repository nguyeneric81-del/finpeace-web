import os
import sys
import time
import math
import argparse
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '../.env.local')
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
VNSTOCK_API_KEY = os.environ.get("VNSTOCK_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Lỗi: Không tìm thấy SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize vnstock & register API key if present
try:
    if VNSTOCK_API_KEY:
        from vnstock.core import setup_api_key
        setup_api_key(VNSTOCK_API_KEY)
except Exception:
    pass

from vnstock import Vnstock

def clean_val(val):
    if val is None:
        return None
    if isinstance(val, (float, int)):
        if math.isnan(val) or math.isinf(val):
            return None
        return float(val)
    return val

def clean_bigint(val):
    cv = clean_val(val)
    if cv is None:
        return None
    try:
        return int(round(cv))
    except:
        return None

def fetch_with_retry(fetch_fn, max_retries=3, backoff_sec=38):
    """Executes fetch function with automatic rate limit backoff."""
    for attempt in range(max_retries):
        try:
            return fetch_fn()
        except SystemExit:
            print(f" [Rate limit detected, sleeping {backoff_sec}s...]", end="", flush=True)
            time.sleep(backoff_sec)
        except Exception as e:
            err_msg = str(e).lower()
            if "rate limit" in err_msg or "too many" in err_msg or "429" in err_msg:
                print(f" [Rate limit: waiting {backoff_sec}s...]", end="", flush=True)
                time.sleep(backoff_sec)
            else:
                return None
    return None

def sync_report_type(stock_obj, ticker: str, report_type: str, table_name: str, period: str = 'quarter'):
    try:
        if report_type == 'income_statement':
            df = fetch_with_retry(lambda: stock_obj.finance.income_statement(period=period))
        elif report_type == 'balance_sheet':
            df = fetch_with_retry(lambda: stock_obj.finance.balance_sheet(period=period))
        elif report_type == 'cash_flow':
            df = fetch_with_retry(lambda: stock_obj.finance.cash_flow(period=period))
        else:
            return 0

        if df is None or df.empty:
            return 0

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
            supabase.table(table_name).upsert(records, on_conflict="ticker,period,year").execute()
            return len(records)
    except Exception:
        pass
    return 0

def sync_ticker(ticker: str):
    stock = Vnstock().stock(symbol=ticker, source='VCI')
    is_cnt = sync_report_type(stock, ticker, 'income_statement', 'income_statements')
    time.sleep(0.5)
    bs_cnt = sync_report_type(stock, ticker, 'balance_sheet', 'balance_sheets')
    time.sleep(0.5)
    cf_cnt = sync_report_type(stock, ticker, 'cash_flow', 'cash_flows')
    return is_cnt + bs_cnt + cf_cnt

def get_all_synced_tickers():
    """Fetches all distinct tickers that already have income_statements in Supabase using pagination."""
    synced = set()
    page_size = 1000
    page = 0
    while True:
        res = supabase.table("income_statements").select("ticker").range(page * page_size, (page + 1) * page_size - 1).execute()
        if not res.data:
            break
        for r in res.data:
            synced.add(r["ticker"])
        if len(res.data) < page_size:
            break
        page += 1
    return synced

def get_all_companies(exchange="ALL"):
    """Fetches all companies from Supabase using pagination."""
    companies = []
    page_size = 1000
    page = 0
    while True:
        query = supabase.table("companies").select("ticker, exchange").order("ticker").range(page * page_size, (page + 1) * page_size - 1)
        if exchange.upper() != "ALL":
            query = query.eq("exchange", exchange.upper())
        res = query.execute()
        if not res.data:
            break
        companies.extend(res.data)
        if len(res.data) < page_size:
            break
        page += 1
    return companies

def main():
    parser = argparse.ArgumentParser(description="Sync Financial Statements for HOSE, HNX, UPCOM to Supabase")
    parser.add_argument("--exchange", type=str, default="ALL", help="HOSE, HNX, UPCOM, or ALL")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of tickers to sync")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay between tickers in seconds (default 2s for safe rate limits)")
    parser.add_argument("--force", action="store_true", help="Re-sync already processed tickers")
    args = parser.parse_args()

    companies = get_all_companies(args.exchange)
    all_tickers = [r["ticker"] for r in companies]

    synced_tickers = get_all_synced_tickers() if not args.force else set()
    tickers_list = [t for t in all_tickers if t not in synced_tickers]

    print(f"📊 Tổng số mã: {len(all_tickers)}. Đã đồng bộ: {len(synced_tickers)}. Còn lại cần xử lý: {len(tickers_list)} mã.")

    if args.limit:
        tickers_list = tickers_list[:args.limit]

    total = len(tickers_list)
    if total == 0:
        print("🎉 Toàn bộ 100% mã thị trường đã được đồng bộ đầy đủ!")
        return

    print(f"🚀 Bắt đầu quét BCTC cho {total} mã còn lại (Sàn: {args.exchange}, Delay: {args.delay}s)...")

    success_count = 0
    start_time = time.time()

    for idx, ticker in enumerate(tickers_list, 1):
        print(f"[{idx}/{total}] Đang xử lý {ticker}...", end="", flush=True)
        try:
            total_records = sync_ticker(ticker)
            if total_records > 0:
                print(f" ✅ ({total_records} bản ghi)")
                success_count += 1
            else:
                print(" ⏩ Không có dữ liệu")
        except Exception as e:
            print(f" ❌ Lỗi: {e}")

        time.sleep(args.delay)

    elapsed = round(time.time() - start_time, 1)
    print(f"\n🎉 HOÀN TẤT! Đã đồng bộ thành công {success_count}/{total} mã trong {elapsed}s.")

if __name__ == "__main__":
    main()
