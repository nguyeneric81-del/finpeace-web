import sys
import argparse
import yfinance as yf
import pandas as pd
import numpy as np
import json

def get_stats(ticker):
    yf_ticker = f"{ticker.upper()}.VN"
    stock = yf.Ticker(yf_ticker)
    df = stock.history(period="1y")
    if df is None or df.empty:
        return None
        
    df = df.rename(columns={"Open": "open", "High": "high", "Low": "low", "Close": "close", "Volume": "volume"})
    
    # Moving Averages
    df['MA20'] = df['close'].rolling(window=20).mean()
    df['MA50'] = df['close'].rolling(window=50).mean()
    df['MA200'] = df['close'].rolling(window=200).mean()
    
    # RSI 14d
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI_14'] = 100 - (100 / (1 + rs))
    
    # MACD
    exp1 = df['close'].ewm(span=12, adjust=False).mean()
    exp2 = df['close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    df['Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    df['Hist'] = df['MACD'] - df['Signal']
    
    # Bollinger Bands
    df['std20'] = df['close'].rolling(window=20).std()
    df['BB_upper'] = df['MA20'] + (df['std20'] * 2)
    df['BB_lower'] = df['MA20'] - (df['std20'] * 2)
    
    # Stochastic
    low_14 = df['low'].rolling(window=14).min()
    high_14 = df['high'].rolling(window=14).max()
    df['%K'] = 100 * ((df['close'] - low_14) / (high_14 - low_14))
    df['%D'] = df['%K'].rolling(window=3).mean()
    
    # Volume MA
    df['Vol20'] = df['volume'].rolling(window=20).mean()
    
    latest = df.iloc[-1]
    prev = df.iloc[-2]
    prev2 = df.iloc[-3]
    
    # --- Scoring ---
    trend_score = 0
    # 1. Price > MA20 and MA20 > MA50
    if latest['close'] > latest['MA20'] and latest['MA20'] > latest['MA50']:
        trend_score += 1
    # 2. MACD Histogram is positive
    if latest['Hist'] > 0:
        trend_score += 1
    # 3. Long-term trend: Price > MA200
    if latest['close'] > latest['MA200']:
        trend_score += 1
    # 4. Acceleration: close is rising over last 2 candles
    if latest['close'] > prev['close'] and prev['close'] > prev2['close']:
        trend_score += 1
    # 5. MA20 slope is positive
    if latest['MA20'] > prev['MA20']:
        trend_score += 1
        
    sideway_score = 0
    # 1. RSI is neutral-bullish (35-65)
    if 35 <= latest['RSI_14'] <= 65:
        sideway_score += 1
    # 2. Stochastic buy trigger (%K crossed up %D from below 30)
    if latest['%K'] > latest['%D'] and (prev['%K'] <= prev['%D'] or latest['%K'] < 30):
        sideway_score += 1
    # 3. Bollinger lower band support (close within 2% of BB_lower or below it and reversing)
    if latest['close'] <= latest['BB_lower'] * 1.02:
        sideway_score += 1
    # 4. Volume drying up (latest vol < Vol20 average)
    if latest['volume'] < latest['Vol20']:
        sideway_score += 1
    # 5. Reversal candle (closed green after red)
    if latest['close'] > latest['open'] and prev['close'] < prev['open']:
        sideway_score += 1
        
    # Matrix Evaluation
    evaluation = "Theo dõi / Tranh chấp"
    action = "HOLD / WATCH"
    if trend_score >= 4 and sideway_score <= 2:
        evaluation = "Breakout Tăng / Siêu Vuốt Xu Hướng"
        action = "PASS (Ưu tiên Mua đuổi / Gia tăng)"
    elif trend_score >= 4 and sideway_score >= 3:
        evaluation = "Quá Mua / Rủi ro Chốt Lời"
        action = "TAKE PROFIT / HOLD (Hạn chế mua mới)"
    elif trend_score <= 1 and sideway_score >= 4:
        evaluation = "Tích lũy Tuyệt đối / Nén Đáy"
        action = "PASS (Mua Thăm dò 30% tại nền)"
    elif trend_score <= 1 and sideway_score <= 1:
        evaluation = "Bán Khống / Rơi Tự Do"
        action = "SKIP (Đứng ngoài, không bắt dao rơi)"
    elif trend_score >= 2 and sideway_score >= 2:
        evaluation = "Tranh chấp Hỗn loạn (Messy)"
        action = "HOLD / WATCH (Chờ tín hiệu xác nhận rõ hơn)"
        
    return {
        "ticker": ticker.upper(),
        "close": float(latest['close']),
        "MA20": float(latest['MA20']),
        "MA50": float(latest['MA50']),
        "MA200": float(latest['MA200']),
        "RSI_14": float(latest['RSI_14']),
        "MACD_Hist": float(latest['Hist']),
        "Stoch_K": float(latest['%K']),
        "Stoch_D": float(latest['%D']),
        "trend_score": trend_score,
        "sideway_score": sideway_score,
        "evaluation": evaluation,
        "action": action
    }

def main():
    parser = argparse.ArgumentParser(description="Compare two tickers")
    parser.add_argument("ticker_a", type=str)
    parser.add_argument("ticker_b", type=str)
    args = parser.parse_args()
    
    res_a = get_stats(args.ticker_a)
    res_b = get_stats(args.ticker_b)
    
    if not res_a or not res_b:
        print(json.dumps({"error": "Failed to fetch data for one or both tickers."}))
        return
        
    # Generate Markdown Report
    output = []
    output.append(f"⚔️ **SO SÁNH KỸ THUẬT: {res_a['ticker']} vs {res_b['ticker']}**")
    output.append(f"*(Cập nhật giá đóng cửa gần nhất)*\n")
    
    # Table comparison
    output.append(f"| Chỉ số | **{res_a['ticker']}** | **{res_b['ticker']}** |")
    output.append(f"| :--- | :---: | :---: |")
    output.append(f"| **Giá hiện tại** | {res_a['close']:,.0f} | {res_b['close']:,.0f} |")
    output.append(f"| **RSI (14 ngày)** | {res_a['RSI_14']:.1f} | {res_b['RSI_14']:.1f} |")
    output.append(f"| **Stochastic %K / %D** | {res_a['Stoch_K']:.1f} / {res_a['Stoch_D']:.1f} | {res_b['Stoch_K']:.1f} / {res_b['Stoch_D']:.1f} |")
    output.append(f"| **Động lượng MACD** | {'Tăng' if res_a['MACD_Hist'] > 0 else 'Giảm'} | {'Tăng' if res_b['MACD_Hist'] > 0 else 'Giảm'} |")
    output.append(f"| **SMA200 Kháng cự** | {'Dưới SMA200' if res_a['close'] < res_a['MA200'] else 'Trên SMA200'} | {'Dưới SMA200' if res_b['close'] < res_b['MA200'] else 'Trên SMA200'} |\n")
    
    output.append(f"📊 **Trend Matrix Scoring (0-5)**")
    output.append(f"- **{res_a['ticker']}**: Xu hướng `{res_a['trend_score']}/5` | Dao động `{res_a['sideway_score']}/5` -> **{res_a['evaluation']}**")
    output.append(f"- **{res_b['ticker']}**: Xu hướng `{res_b['trend_score']}/5` | Dao động `{res_b['sideway_score']}/5` -> **{res_b['evaluation']}**\n")
    
    # Comparative analysis
    output.append(f"🔮 **Khuyến nghị hành động (Trading Action)**")
    output.append(f"- **{res_a['ticker']}**: {res_a['action']}")
    output.append(f"- **{res_b['ticker']}**: {res_b['action']}\n")
    
    # Recommendation logic
    score_a = res_a['trend_score'] + res_a['sideway_score']
    score_b = res_b['trend_score'] + res_b['sideway_score']
    
    rec = ""
    if res_a['evaluation'] == "Bán Khống / Rơi Tự Do" and res_b['evaluation'] != "Bán Khống / Rơi Tự Do":
        rec = f"👉 Nên ưu tiên cấu trúc của **{res_b['ticker']}** vì **{res_a['ticker']}** đang ở pha rơi tự do nguy hiểm."
    elif res_b['evaluation'] == "Bán Khống / Rơi Tự Do" and res_a['evaluation'] != "Bán Khống / Rơi Tự Do":
        rec = f"👉 Nên ưu tiên cấu trúc của **{res_a['ticker']}** vì **{res_b['ticker']}** đang ở pha rơi tự do nguy hiểm."
    elif "PASS" in res_a['action'] and "PASS" not in res_b['action']:
        rec = f"👉 Ưu tiên điểm mua của **{res_a['ticker']}** nhờ cấu trúc tích lũy/breakout đẹp hơn."
    elif "PASS" in res_b['action'] and "PASS" not in res_a['action']:
        rec = f"👉 Ưu tiên điểm mua của **{res_b['ticker']}** nhờ cấu trúc tích lũy/breakout đẹp hơn."
    elif score_a > score_b:
        rec = f"👉 Kỹ thuật đánh giá **{res_a['ticker']}** đang có cấu trúc tích lũy/động lượng tốt hơn so với **{res_b['ticker']}**."
    elif score_b > score_a:
        rec = f"👉 Kỹ thuật đánh giá **{res_b['ticker']}** đang có cấu trúc tích lũy/động lượng tốt hơn so với **{res_a['ticker']}**."
    else:
        rec = f"👉 Cả hai mã đang ở trạng thái kỹ thuật cân bằng. Nên kết hợp phân tích cơ bản (FA) hoặc ưu tiên mã có tỷ lệ R:R tốt hơn."
        
    output.append(rec)
    
    print("\n".join(output))

if __name__ == "__main__":
    main()
