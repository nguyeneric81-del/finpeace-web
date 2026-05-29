import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase config missing.")
    exit(1)

supabase: Client = create_client(url, key)

print("Loading original CSV for Subscriber names...")
csv_path = '/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/SIP_ProcessingData - DealOrder.G.csv'
df_csv = pd.read_csv(csv_path)

subscriber_map = {}
for _, row in df_csv.iterrows():
    email_val = str(row.get('Email')).strip()
    if email_val.lower() == 'nan': 
        continue
    email = email_val.lower()
    
    subscriber_val = str(row.get('subscribers')).strip()
    if subscriber_val and subscriber_val.lower() not in ['nan', 'none', '']:
        if email not in subscriber_map:
            subscriber_map[email] = subscriber_val

print(f"Found {len(subscriber_map)} unique email-to-name mappings in CSV.")

print("Fetching profiles from Database...")
profiles_resp = supabase.table("profiles").select("id, email, full_name").execute()

updates_made = 0
for profile in profiles_resp.data:
    p_email = profile.get('email')
    if not p_email:
        continue
    
    p_email_lower = p_email.lower().strip()
    current_name = str(profile.get('full_name') or "").strip()
    csv_name = subscriber_map.get(p_email_lower)
    
    if csv_name:
        is_empty = not current_name or current_name.lower() == 'none'
        
        # Update if the DB profile name is empty OR if it doesn't match the CSV exact name
        if is_empty or current_name != csv_name:
            print(f"Updating profile {p_email_lower}: '{current_name}' -> '{csv_name}'")
            try:
                supabase.table("profiles").update({"full_name": csv_name}).eq("id", profile['id']).execute()
                updates_made += 1
            except Exception as e:
                print(f"Failed to update {p_email_lower}: {e}")

print(f"\n✅ Execution Finished! Successfully updated {updates_made} profiles in the database.")
