import os
import requests
import datetime
import csv

url_base = "https://slooouceqcarcccryjyt.supabase.co/rest/v1"
key = "sb_secret_Xr5mJStvMoCqBLU2_5qhow_chvFxoMc"
headers = {"apikey": key, "Authorization": f"Bearer {key}"}

def fetch_data(table):
    r = requests.get(f"{url_base}/{table}?select=*", headers=headers)
    return r.json()

kb_leads = fetch_data('kb_leads')
agent_leads = fetch_data('agent_leads')
kb_account_requests = fetch_data('kb_account_requests')

all_leads = []

for row in kb_leads:
    date_str = row.get('created_at', '')
    if date_str:
        try:
            d = datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            date_str = d.strftime("%Y-%m-%d %H:%M:%S")
        except:
            pass
            
    all_leads.append({
        'Email': row.get('email', '') or '',
        'SDT': row.get('phone', '') or '',
        'Ten': row.get('name', '') or '',
        'Agent': row.get('sales_code', '') or 'Org',
        'Ngay tao': date_str,
        'Nguon': f"KB: {row.get('article_slug', '')}"
    })

for row in agent_leads:
    date_str = row.get('registered_at', '')
    if date_str:
        try:
            d = datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            date_str = d.strftime("%Y-%m-%d %H:%M:%S")
        except:
            pass
            
    all_leads.append({
        'Email': row.get('email', '') or '',
        'SDT': row.get('phone', '') or '',
        'Ten': row.get('full_name', '') or '',
        'Agent': row.get('ref_code', '') or 'N/A',
        'Ngay tao': date_str,
        'Nguon': f"Landing Page: {row.get('utm_source', '')}"
    })

for row in kb_account_requests:
    date_str = row.get('requested_at', '')
    if date_str:
        try:
            d = datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            date_str = d.strftime("%Y-%m-%d %H:%M:%S")
        except:
            pass
            
    all_leads.append({
        'Email': row.get('user_email', '') or '',
        'SDT': row.get('user_phone', '') or '',
        'Ten': row.get('user_name', '') or '',
        'Agent': 'FinPeace',
        'Ngay tao': date_str,
        'Nguon': f"KB Account Request: {row.get('content_title', '')}"
    })

all_leads.sort(key=lambda x: x['Ngay tao'], reverse=True)

with open('/Users/tuananhnguyen/workspace-gravity/finpeace-web/finpeace_leads_report.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['Email', 'SDT', 'Ten', 'Agent', 'Ngay tao', 'Nguon'])
    writer.writeheader()
    writer.writerows(all_leads)

print(f"Generated CSV with {len(all_leads)} leads at /Users/tuananhnguyen/workspace-gravity/finpeace-web/finpeace_leads_report.csv")
