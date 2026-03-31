import os
from supabase import create_client
from dotenv import load_dotenv
load_dotenv('.env.local')

supabase = create_client(os.getenv('NEXT_PUBLIC_SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

# 1. Archive old TCB plans
old_tcb = supabase.table('trading_plans').select('id').eq('ticker', 'TCB').execute()
for plan in old_tcb.data:
    supabase.table('trading_plans').update({'ticker': f"TCB_ARCHIVED_{plan['id'][:4]}", 'status': 'archived'}).eq('id', plan['id']).execute()

# 2. Publish TCX as TCB
tcx = supabase.table('trading_plans').select('id, analyst_note').eq('ticker', 'TCX').execute()
if tcx.data:
    # replace TCX with TCB in the note
    note = tcx.data[0]['analyst_note'].replace('TCX', 'TCB')
    res = supabase.table('trading_plans').update({
        'ticker': 'TCB',
        'company_name': 'Ngân hàng TMCP Kỹ Thương Việt Nam',
        'is_confirmed': True,
        'status': 'active',
        'analyst_note': note
    }).eq('id', tcx.data[0]['id']).execute()
    print("TCB plan officially published to the App!")
else:
    print("Failed to find TCX plan.")
