import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

def get_supabase_client() -> Client:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_path = os.path.join(project_root, '.env.local')
    load_dotenv(dotenv_path=env_path)

    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
        exit(1)

    return create_client(url, key)

def sync_vvia_reports():
    supabase = get_supabase_client()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    reports_dir = os.path.join(project_root, 'knowledgebase', 'vvia-reports')
    
    if not os.path.exists(reports_dir):
        print(f"Directory not found: {reports_dir}")
        return

    for filename in os.listdir(reports_dir):
        if not filename.endswith('.md'):
            continue
            
        filepath = os.path.join(reports_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract ticker from title (e.g., "# Phân Tích Cơ Bản: ... (MWG)")
        ticker_match = re.search(r'\(([A-Z]{3})\)', content)
        if not ticker_match:
            print(f"Skipping {filename} - No ticker found in content.")
            continue
            
        ticker = ticker_match.group(1)
        
        # Determine company name
        name_match = re.search(r'# Phân Tích Cơ Bản: (.*?)(?:\s*\([A-Z]{3}\))', content)
        company_name = name_match.group(1).strip() if name_match else ticker
        
        print(f"Processing {ticker} - {company_name}...")
        
        # Upsert into macro_insights
        record = {
            "published": True,
            "companies": [{"ticker": ticker, "name": company_name}],
            "analyst_view": content,
            # Mocking key_stats based on VVIA standard
            "key_stats": [
                {"label": "Thanh khoản", "value": "An Toàn", "positive": True},
                {"label": "Vị thế ngành", "value": "Đầu ngành", "positive": True},
                {"label": "Rủi ro Vĩ mô", "value": "Đã tính toán", "positive": False}
            ]
        }
        
        # In a real scenario, we might want to update an existing record or insert a new one.
        # Here we'll just insert a new one.
        try:
            supabase.table('macro_insights').insert(record).execute()
            print(f"✅ Successfully inserted VVIA report for {ticker}")
        except Exception as e:
            print(f"❌ Error inserting {ticker}: {e}")

if __name__ == "__main__":
    sync_vvia_reports()
