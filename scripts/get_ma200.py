from vnstock import stock_historical_data
from datetime import datetime, timedelta
import urllib3
urllib3.disable_warnings()

end_date = datetime.now().strftime("%Y-%m-%d")
# We need at least 200 trading days, so 365 days is enough
start_date = (datetime.now() - timedelta(days=350)).strftime("%Y-%m-%d")

for ticker in ['FPT', 'HPG', 'SSI']:
    try:
        df = stock_historical_data(symbol=ticker, start_date=start_date, end_date=end_date, resolution='1D', type='stock')
        if df is not None and not df.empty:
            df['close'] = df['close'].astype(float)
            ma200 = df['close'].tail(200).mean()
            print(f"{ticker}: MA200 = {ma200:.0f}")
        else:
            print(f"{ticker}: Empty df")
    except Exception as e:
        print(f"{ticker}: Error - {e}")
