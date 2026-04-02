import os
import requests
import datetime

url_base = "https://slooouceqcarcccryjyt.supabase.co/rest/v1"
key = "sb_secret_Xr5mJStvMoCqBLU2_5qhow_chvFxoMc"
headers = {"apikey": key, "Authorization": f"Bearer {key}"}

def fetch_data(table):
    r = requests.get(f"{url_base}/{table}?select=*", headers=headers)
    return r.json()

kb_leads = fetch_data('kb_leads')
agent_leads = fetch_data('agent_leads')
kb_account_requests = fetch_data('kb_account_requests')

# We need columns: [Email, Số điện thoại, Tên Khách hàng, Agent, Ngày tạo, Nguồn / Content]
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
        'SĐT': row.get('phone', '') or '',
        'Tên': row.get('name', '') or '',
        'Agent': row.get('sales_code', '') or 'Org',
        'Ngày tạo': date_str,
        'Nguồn / Content': f"KB: {row.get('article_slug', '')}"
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
        'SĐT': row.get('phone', '') or '',
        'Tên': row.get('full_name', '') or '',
        'Agent': row.get('ref_code', '') or 'N/A',
        'Ngày tạo': date_str,
        'Nguồn / Content': f"Landing Page: {row.get('utm_source', '')}"
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
        'SĐT': row.get('user_phone', '') or '',
        'Tên': row.get('user_name', '') or '',
        'Agent': 'FinPeace',
        'Ngày tạo': date_str,
        'Nguồn / Content': f"KB Account Request: {row.get('content_title', '')}"
    })

# Sort by date descending
all_leads.sort(key=lambda x: x['Ngày tạo'], reverse=True)

# Generate HTML Table
html = """
<html>
<head><meta charset="utf-8"/></head>
<body>
<table id="leadsTable">
    <thead>
        <tr>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Tên Khách hàng</th>
            <th>Agent (Mã Sales)</th>
            <th>Ngày tạo</th>
            <th>Nguồn / Content Navigate</th>
        </tr>
    </thead>
    <tbody>
"""

for lead in all_leads:
    html += f"""
        <tr>
            <td>{lead['Email']}</td>
            <td>{lead['SĐT']}</td>
            <td>{lead['Tên']}</td>
            <td>{lead['Agent']}</td>
            <td>{lead['Ngày tạo']}</td>
            <td>{lead['Nguồn / Content']}</td>
        </tr>
"""

html += """
    </tbody>
</table>
</body>
</html>
"""

with open('/tmp/leads_table.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Generated HTML with {len(all_leads)} leads at /tmp/leads_table.html")
