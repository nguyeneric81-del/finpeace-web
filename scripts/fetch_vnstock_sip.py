import json
import os
from vnstock import *

TICKERS = ['SSI', 'TLG', 'VNM', 'HPG', 'BCM', 'FOX', 'FPT', 'GAS', 'IMP', 'MBB', 'MIG', 'NLG', 'PNJ', 'TPB', 'VPB']
results = {}

for ticker in TICKERS:
    try:
        print(f"Fetching {ticker}...")
        
        # Financial Ratios (Quarterly to get latest)
        ratio_df = financial_ratio(symbol=ticker, report_range='quarterly', is_all=False)
        # Convert df to dict
        latest_ratio = ratio_df.iloc[:, 0].to_dict() if not ratio_df.empty else {}
        
        # Financial Reports (Income Statement)
        try:
            inc_df = financial_flow(symbol=ticker, report_type='incomestatement', report_range='quarterly')
            recent_inc = inc_df.iloc[:, 0:4].to_dict() if not inc_df.empty else {}
        except Exception:
            recent_inc = {}
            
        try:
            bal_df = financial_flow(symbol=ticker, report_type='balancesheet', report_range='quarterly')
            recent_bal = bal_df.iloc[:, 0].to_dict() if not bal_df.empty else {}
        except Exception:
            recent_bal = {}

        results[ticker] = {
            'ratios': latest_ratio,
            'income': recent_inc,
            'balance': recent_bal
        }
    except Exception as e:
        print(f"Failed {ticker}: {e}")
        results[ticker] = {"error": str(e)}

out_path = os.path.join(os.path.dirname(__file__), 'tcbs_sip_data.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Done! Saved to {out_path}")
