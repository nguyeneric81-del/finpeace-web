from vnstock import stock_historical_data
from datetime import datetime, timedelta
import urllib3
urllib3.disable_warnings()

end_date = datetime.now().strftime("%Y-%m-%d")
start_date = (datetime.now() - timedelta(days=350)).strftime("%Y-%m-%d")

tickers = ['TLG', 'VNM', 'BCM', 'FOX', 'GAS', 'IMP', 'MBB', 'MIG', 'NLG', 'PNJ', 'TPB', 'VPB']
results = {}

for ticker in tickers:
    try:
        df = stock_historical_data(symbol=ticker, start_date=start_date, end_date=end_date, resolution='1D', type='stock')
        if df is not None and not df.empty:
            df['close'] = df['close'].astype(float)
            ma200 = df['close'].tail(200).mean()
            results[ticker] = int(ma200)
        else:
            results[ticker] = 0
    except Exception as e:
        results[ticker] = 0

print("BATCH_MA200_RESULT")
print(results)
