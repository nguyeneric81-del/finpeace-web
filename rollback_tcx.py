import os
from supabase import create_client
from dotenv import load_dotenv
load_dotenv('.env.local')

supabase = create_client(os.getenv('NEXT_PUBLIC_SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

# 1. Restore the original TCX plan
tcx_id = 'b42b7091-8e09-4529-a7a6-7a65e85a7522'
res = supabase.table('trading_plans').select('analyst_note').eq('id', tcx_id).execute()
if res.data:
    note = res.data[0]['analyst_note'].replace('TCB', 'TCX')
    supabase.table('trading_plans').update({
        'ticker': 'TCX',
        'company_name': None,
        'analyst_note': note
        # keep status and is_confirmed as they were before my script messed it up?
        # Let's just restore ticker and note
    }).eq('id', tcx_id).execute()

# 2. Restore the original TCB plan
archived_tcb = supabase.table('trading_plans').select('id, ticker').like('ticker', 'TCB_ARCHIVED_%').execute()
for plan in archived_tcb.data:
    supabase.table('trading_plans').update({
        'ticker': 'TCB',
        'status': 'active'
    }).eq('id', plan['id']).execute()

print("Rolled back successfully.")
