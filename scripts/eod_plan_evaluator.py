import os
import json
import argparse
import yfinance as yf
from datetime import date
from dotenv import load_dotenv
from supabase import create_client
import google.generativeai as genai

# Load environment
env_path = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local'
load_dotenv(env_path)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or not GEMINI_KEY:
    raise ValueError("Missing environment variables for Supabase or Gemini")

# Init clients
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_KEY)

# Use gemini-1.5-flash for speed and cost efficiency since task is relatively straightforward
model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

PROMPT_TEMPLATE = """Bạn là chuyên gia quản trị rủi ro danh mục (Risk Manager) của công ty chứng khoán FinPeace.
Nhiệm vụ của bạn là rà soát Kế hoạch giao dịch (Trading Plan) đang Active và đối chiếu với dữ liệu giá Đóng cửa (EOD) của mã chứng khoán ngày hôm nay.

THÔNG TIN TRADING PLAN:
- Mã cổ phiếu: {ticker}
- Chiến lược: {strategy}
- Vùng mua dự kiến (Entry Zone): {entry_zone}
- Mức cắt lỗ (Stop Loss): {stop_loss}
- Mức chốt lời (Take Profit): {take_profit}
- Kịch bản & Điều kiện vào lệnh: {entry_criteria}
- Kịch bản & Điều kiện thoát lệnh: {exit_criteria}
- Ghi chú: {analyst_note}

DỮ LIỆU THỰC TẾ CUỐI NGÀY HÔM NAY:
- Giá đóng cửa: {current_price}

YÊU CẦU:
Hãy phân tích xem với mức giá đóng cửa hiện tại, Kế hoạch giao dịch này có đang kích hoạt MUA, chạm CẮT LỖ, hay đạt CHỐT LỜI không?
Trả về ĐÚNG định dạng JSON sau, không có markdown text dư thừa:
{{
    "suggested_action": "enum", // Chỉ chọn 1 trong: HOLD, TRIGGER_BUY, TAKE_PROFIT, STOP_LOSS, CANCEL
    "reasoning": "string" // Giải thích ngắn gọn lý do tại sao đề xuất hành động này (khoảng 3-4 câu). Nhớ xưng hô là "Hệ thống AI rà soát EOD".
}}

Lưu ý: 
- Nếu giá hiện tại rơi vào vùng Entry Zone -> TRIGGER_BUY
- Nếu giá vi phạm Stop Loss -> STOP_LOSS
- Nếu giá đạt hoặc vượt Take Profit -> TAKE_PROFIT
- Nếu giá đang lơ lửng, chưa vi phạm gì hoặc chưa tới vùng mua -> HOLD
"""

def fetch_eod_price(ticker):
    """Lấy giá đóng cửa của mã cổ phiếu VN qua yfinance"""
    try:
        yf_ticker = f"{ticker}.VN"
        stock = yf.Ticker(yf_ticker)
        # Lấy data 1 ngày gần nhất
        hist = stock.history(period="1d")
        if not hist.empty:
            return round(hist['Close'].iloc[-1], 2)
        return None
    except Exception as e:
        print(f"Lỗi khi lấy giá {ticker}: {e}")
        return None

def evaluate_plan(plan, current_price):
    """Gọi LLM để phân tích và đề xuất hành động"""
    prompt = PROMPT_TEMPLATE.format(
        ticker=plan.get('ticker'),
        strategy=plan.get('strategy_name', 'N/A'),
        entry_zone=plan.get('entry_zone', 'N/A'),
        stop_loss=plan.get('stop_loss', 'N/A'),
        take_profit=plan.get('take_profit', 'N/A'),
        entry_criteria=plan.get('entry_criteria', 'N/A'),
        exit_criteria=plan.get('exit_criteria', 'N/A'),
        analyst_note=plan.get('analyst_note', 'N/A'),
        current_price=current_price
    )
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"LLM Error for {plan.get('ticker')}: {e}")
        return {"suggested_action": "HOLD", "reasoning": "Lỗi khi gọi AI phân tích."}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test-ticker", type=str, help="Chạy thử nghiệm cho 1 mã cụ thể (VD: VIC)")
    args = parser.parse_args()

    print(f"Bắt đầu quy trình Đánh giá EOD Trading Plans - Ngày {date.today().isoformat()}")
    
    # 1. Lấy các trading_plans đang active
    query = supabase.table('trading_plans').select('*').eq('status', 'active')
    if args.test_ticker:
        query = query.eq('ticker', args.test_ticker.upper())
        
    plans_res = query.execute()
    plans = plans_res.data
    
    if not plans:
        print("Không có Trading Plan nào đang Active.")
        return
        
    print(f"Tìm thấy {len(plans)} Trading Plans cần rà soát.")
    
    actions_count = 0
    
    for plan in plans:
        ticker = plan['ticker']
        plan_id = plan['id']
        
        # 2. Lấy giá EOD
        price = fetch_eod_price(ticker)
        if not price:
            print(f"[{ticker}] Bỏ qua vì không lấy được giá EOD.")
            continue
            
        print(f"[{ticker}] Giá EOD: {price} - Đang gọi AI đánh giá...")
        
        # 3. Phân tích qua LLM
        eval_result = evaluate_plan(plan, price)
        action = eval_result.get('suggested_action', 'HOLD')
        reasoning = eval_result.get('reasoning', '')
        
        print(f"  -> Đề xuất: {action}")
        if action != 'HOLD':
            actions_count += 1
            
        # 4. Lưu vào Supabase bảng trading_plan_daily_reviews
        payload = {
            "plan_id": plan_id,
            "review_date": date.today().isoformat(),
            "eod_price": price,
            "suggested_action": action,
            "agent_reasoning": reasoning,
            "status": "pending_approval"
        }
        
        try:
            # Upsert nếu lỡ chạy script 2 lần trong 1 ngày (dựa trên constraint UNIQUE)
            # Supabase Python client không hỗ trợ ON CONFLICT qua .insert(), nên ta xoá cũ trước
            supabase.table('trading_plan_daily_reviews').delete().eq('plan_id', plan_id).eq('review_date', payload['review_date']).execute()
            supabase.table('trading_plan_daily_reviews').insert(payload).execute()
        except Exception as e:
            print(f"  -> Lỗi lưu DB cho {ticker}: {e}")

    print("=" * 50)
    print("Hoàn tất EOD Review.")
    if actions_count > 0:
        print(f"⚠️ Có {actions_count} plan cần bạn phê duyệt (pending_approval) trên hệ thống!")
        # TODO: Send notification via Discord or Telegram bot here
    else:
        print("✅ Tất cả các plan đều bình thường, chưa cần hành động.")

if __name__ == "__main__":
    main()
