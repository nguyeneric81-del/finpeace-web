import os
import argparse
from datetime import datetime
from supabase import create_client, Client

# Attempt to load vnstock3 (New modular API interface)
try:
    from vnstock3 import Vnstock
except ImportError:
    print("WARNING: Please ensure vnstock3 is installed via: pip install vnstock3")

def get_supabase_client():
    url = os.environ.get("SUPABASE_URL", "https://slooouceqcarcccryjyt.supabase.co")
    # For writing scripts locally, use the service role key or anon key with proper RLS
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", os.environ.get("SUPABASE_ANON_KEY", ""))
    
    if not key:
        print("ERROR: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be set in environment variables.")
        exit(1)
        
    return create_client(url, key)

def fetch_and_load_financial_ratios(ticker: str, supabase: Client):
    print(f"Fetching financial ratios for {ticker}...")
    try:
        stock = Vnstock().stock(symbol=ticker, source='VCI') # Or TCBS
        # Fetch yearly ratio for up to 10 years
        df = stock.finance.ratio(period='year', limit=10)
        
        if df.empty:
            print(f"No ratio data found for {ticker}")
            return
            
        records = []
        for index, row in df.iterrows():
            # Adjust column mapping depending on vnstock3 new schema if needed
            year = str(row.get('period', row.get('year', '')))
            
            if not year:
                continue
                
            record = {
                "ticker": ticker,
                "period_type": "YEAR",
                "period_value": str(year)[:4], # Extract 2023 from 2023-12-31 etc
                "report_date": f"{str(year)[:4]}-12-31",
                "pe_ratio": float(row.get('priceToEarning', row.get('pe', 0))),
                "pb_ratio": float(row.get('priceToBook', row.get('pb', 0))),
                "roe": float(row.get('roe', 0)),
                "roa": float(row.get('roa', 0)),
                "roic": float(row.get('roic', 0)), # If available
                "current_ratio": float(row.get('currentRatio', 0)),
                "debt_to_equity": float(row.get('debtOnEquity', 0)),
            }
            records.append(record)
            
        # Upsert to Supabase
        for record in records:
            response = supabase.table('financial_ratios').upsert(
                record, on_conflict='ticker, period_type, period_value'
            ).execute()
            
        print(f"✅ Successfully inserted {len(records)} ratio records for {ticker}")
        
    except Exception as e:
        print(f"❌ Error processing ratios for {ticker}: {str(e)}")

def fetch_and_load_financial_statements(ticker: str, supabase: Client):
    print(f"Fetching financial statements for {ticker}...")
    try:
        stock = Vnstock().stock(symbol=ticker, source='VCI')
        df = stock.finance.financial_report(period='year', limit=10)
        
        if df.empty:
            print(f"No statements data found for {ticker}")
            return
            
        records = []
        for index, row in df.iterrows():
            year = str(row.get('period', row.get('year', '')))
            if not year:
                continue
                
            record = {
                "ticker": ticker,
                "period_type": "YEAR",
                "period_value": str(year)[:4],
                "report_date": f"{str(year)[:4]}-12-31",
                "total_assets": float(row.get('totalAsset', 0)),
                "equity": float(row.get('ownerEquity', 0)),
                "net_revenue": float(row.get('revenue', 0)),
                "net_income": float(row.get('profitAfterTax', 0)),
                # Map other necessary columns here based on vnstock fields
            }
            records.append(record)
            
        # Upsert
        for record in records:
            response = supabase.table('financial_statements').upsert(
                record, on_conflict='ticker, period_type, period_value'
            ).execute()
            
        print(f"✅ Successfully inserted {len(records)} statement records for {ticker}")

    except Exception as e:
        print(f"❌ Error processing statements for {ticker}: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='Fetch and load test stock data.')
    parser.add_argument('--tickers', type=str, nargs='+', default=['HPG', 'FPT', 'SSI'],
                        help='List of tickers to fetch data for')
    args = parser.parse_args()
    
    supabase = get_supabase_client()
    
    for ticker in args.tickers:
        fetch_and_load_financial_ratios(ticker, supabase)
        fetch_and_load_financial_statements(ticker, supabase)
        
    print("\n🎉 Complete!")

if __name__ == "__main__":
    main()
