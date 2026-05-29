import os
import pandas as pd
from datetime import date
from supabase import create_client
from dotenv import load_dotenv

def main():
    # Load environment variables
    env_path = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local'
    load_dotenv(env_path)

    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        print("Lỗi: Không tìm thấy Supabase URL hoặc Key trong .env.local")
        return

    supabase = create_client(url, key)

    # Đường dẫn file CSV
    csv_path = '/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/Finpeace/SIP_UpdateReport_Q1-2026.csv'
    
    if not os.path.exists(csv_path):
        print(f"Lỗi: Không tìm thấy file {csv_path}")
        return

    print("Đang đọc dữ liệu từ file CSV...")
    # Bỏ qua 2 dòng header đầu tiên
    df = pd.read_csv(csv_path, header=2)
    df = df.dropna(subset=['Mã'])

    review_month = date(2026, 5, 1).isoformat()
    valid_until = date(2026, 7, 30).isoformat()
    disclaimer = "Các thông tin, tuyên bố, dự báo và dự đoán trong báo cáo này hoàn toàn dựa trên quan điểm cá nhân của FinPeace..."

    print(f"Bắt đầu đồng bộ {len(df)} mã cổ phiếu lên Supabase...\n")

    for _, row in df.iterrows():
        ticker = row['Mã']
        
        # Parse numeric values safely
        try:
            iv_str = str(row['Giá trị nội tại mới']).replace(',', '')
            new_iv = float(iv_str) if iv_str else 0
        except:
            new_iv = 0
            
        cta = str(row.get('CTA', 'N/A'))
        biz_review = str(row.get('Nhận định về doanh nghiệp', ''))
        sip_review = str(row.get('Nhận định về tích sản', ''))
        
        # Combine texts for review_note so both are stored in DB
        combined_review = f"**Nhận định Doanh nghiệp:**\n{biz_review}\n\n**Nhận định Tích sản:**\n{sip_review}"

        # Lấy thông tin hiện tại từ watchlist để giữ lại current_price và ma200
        exist_wl = supabase.table('sip_watchlist').select('current_price, ma200_value').eq('ticker', ticker).execute()
        current_price = exist_wl.data[0]['current_price'] if exist_wl.data else 0
        ma200 = exist_wl.data[0]['ma200_value'] if exist_wl.data else 0

        # Cập nhật sip_watchlist
        watchlist_payload = {
            "ticker": ticker,
            "intrinsic_value": new_iv,
            "cta_status": cta,
            "review_note": combined_review,  # Lưu toàn bộ đoạn nhận định vào review_note
            "next_review_date": valid_until
        }
        
        if exist_wl.data:
            supabase.table('sip_watchlist').update(watchlist_payload).eq('ticker', ticker).execute()
        else:
            # Nếu chưa có thì insert thêm
            watchlist_payload["current_price"] = current_price
            watchlist_payload["ma200_value"] = ma200
            supabase.table('sip_watchlist').insert(watchlist_payload).execute()

        # Cập nhật sip_monthly_reviews
        review_payload = {
            "ticker": ticker,
            "review_month": review_month,
            "intrinsic_value": new_iv,
            "market_price": current_price,
            "ma200_value": ma200,
            "cta_status": cta,
            "disclaimer_text": disclaimer,
            "valid_until": valid_until
        }
        
        exist_review = supabase.table('sip_monthly_reviews').select('id').eq('ticker', ticker).eq('review_month', review_month).execute()
        if exist_review.data:
            supabase.table('sip_monthly_reviews').update(review_payload).eq('id', exist_review.data[0]['id']).execute()
        else:
            supabase.table('sip_monthly_reviews').insert(review_payload).execute()
            
        print(f"  [+] Đã đồng bộ thành công: {ticker}")

    print("\nHoàn tất đồng bộ toàn bộ dữ liệu từ CSV lên Supabase!")

if __name__ == "__main__":
    main()
