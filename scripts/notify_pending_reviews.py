import os
import json
from datetime import date
from supabase import create_client
import requests
from dotenv import load_dotenv

# Load environment variables (including Telegram bot token and chat id)
env_path = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')  # Expect to be set in .env
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')      # The chat where you want to receive alerts

if not all([SUPABASE_URL, SUPABASE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID]):
    raise RuntimeError('Missing required environment variables for notification script')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_pending_reviews():
    """Lấy tất cả các review có trạng thái pending_approval cho ngày hôm nay"""
    resp = supabase.table('trading_plan_daily_reviews')\
        .select('id, plan_id, eod_price, suggested_action, agent_reasoning, status, created_at, trading_plans!inner(ticker)')\
        .eq('status', 'pending_approval')\
        .eq('review_date', date.today().isoformat())\
        .execute()
    return resp.data

def format_message(reviews):
    if not reviews:
        return None
    lines = [f"📊 *EOD Trading Plan Review* - {date.today().isoformat()}", ""]
    for r in reviews:
        ticker = r.get('trading_plans', {}).get('ticker', 'UNKNOWN')
        action = r.get('suggested_action')
        price = r.get('eod_price')
        reason = r.get('agent_reasoning')
        lines.append(f"• *{ticker}* – Action: `{action}` – EOD Price: {price}\n  _{reason}_")
    lines.append("\nReply with `/approve <review_id>` or `/reject <review_id>` to update status.")
    return "\n".join(lines)

def send_telegram_message(text):
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'Markdown'
    }
    r = requests.post(url, json=payload)
    r.raise_for_status()
    return r.json()

def main():
    pending = fetch_pending_reviews()
    msg = format_message(pending)
    if msg:
        send_telegram_message(msg)
        print(f'Sent notification for {len(pending)} pending reviews.')
    else:
        print('No pending reviews for today.')

if __name__ == '__main__':
    main()
