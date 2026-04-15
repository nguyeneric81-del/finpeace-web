#!/usr/bin/env python3
"""
Import SIP Customers + Transactions from Excel -> Supabase
Usage: python3 scripts/import_sip_customers.py
"""
import pandas as pd
import requests
import hashlib
import json
from datetime import datetime
from typing import Optional

# Supabase config
SUPABASE_URL = "https://slooouceqcarcccryjyt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsb29vdWNlcWNhcmNjY3J5anl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzgwMDYsImV4cCI6MjA4Nzg1NDAwNn0.XhLqWWN4JKfA68dSfIWjHCWDWORIZjvyLnkR9_cFPtE"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

EXCEL_PATH = "/Users/tuananhnguyen/workspace-gravity/tai lieu FinPeace/SIP_ProcessingData (TA).xlsx"
DEFAULT_PASSWORD = "123456"

def hash_password(pwd: str) -> str:
    # Simple SHA256 hash for temporary password storage
    # NOTE: In production use bcrypt. This is a quick import utility.
    return hashlib.sha256(pwd.encode()).hexdigest()

def upsert_customer(row) -> Optional[str]:
    """Insert/upsert one customer, return their UUID."""
    email = str(row['email']).strip().lower()
    if not email or email == 'nan':
        print(f"  SKIP: no email for {row.get('subscribers','?')}")
        return None

    payload = {
        "email": email,
        "password_hash": hash_password(DEFAULT_PASSWORD),
        "full_name": str(row['subscribers']).strip(),
        "phone": str(row.get('mobile_id', '')).replace('.0','').replace('nan','') or None,
        "start_date": str(row['Start_date'])[:10] if pd.notna(row['Start_date']) else None,
        "end_date": str(row['end_date'])[:10] if pd.notna(row['end_date']) else None,
        "monthly_target": int(row['CashFlow']) if pd.notna(row.get('CashFlow')) else 0,
        "target1_name": str(row.get('Target1', '') or '') or None,
        "target1_value": int(row['TargetValue1']) if pd.notna(row.get('TargetValue1')) else None,
        "target1_months": int(row['TimePlan1']) if pd.notna(row.get('TimePlan1')) else None,
        "broker_company": str(row.get('S_Company', '') or '') or None,
        "broker_account": str(row.get('S_Account', '') or '') or None,
        "dealer_name": str(row.get('Dealer', '') or '') or None,
        "is_active": True,
    }

    # Upsert by email
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/sip_customers?on_conflict=email",
        headers={**HEADERS, "Prefer": "return=representation,resolution=merge-duplicates"},
        data=json.dumps(payload)
    )
    if resp.status_code in (200, 201):
        data = resp.json()
        uid = data[0]['id'] if data else None
        print(f"  OK: {payload['full_name']} ({email}) -> {uid}")
        return uid
    else:
        print(f"  ERR ({resp.status_code}): {email} -> {resp.text[:200]}")
        return None

def insert_transactions(customer_id: str, orders: pd.DataFrame):
    """Insert all deal orders for one customer."""
    rows = []
    for _, r in orders.iterrows():
        if pd.isna(r.get('MCK')):
            continue
        rows.append({
            "customer_id": customer_id,
            "order_date": str(r['OrderDate'])[:10],
            "ticker": str(r['MCK']).strip(),
            "action": str(r.get('CTA', 'MUA')).strip() or 'MUA',
            "target_amount": int(r['Giá trị mua']) if pd.notna(r.get('Giá trị mua')) else None,
            "actual_quantity": int(r['Số lượng mua']) if pd.notna(r.get('Số lượng mua')) else None,
            "actual_amount": int(r['Giá trị mua.1']) if pd.notna(r.get('Giá trị mua.1')) else None,
            "note": str(r.get('Note', '') or ''),
        })

    if not rows:
        return

    # Batch insert
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/sip_deals",
        headers={**HEADERS, "Prefer": "return=minimal"},
        data=json.dumps(rows)
    )
    if resp.status_code in (200, 201):
        print(f"    -> Inserted {len(rows)} deals")
    else:
        print(f"    -> DEAL ERR ({resp.status_code}): {resp.text[:200]}")

def main():
    print("Reading Excel...")
    df_cust = pd.read_excel(EXCEL_PATH, sheet_name='CustomerPlan.T')
    df_orders = pd.read_excel(EXCEL_PATH, sheet_name='DealOrder.G')

    # Filter active customers (end_date > today)
    df_cust['end_date'] = pd.to_datetime(df_cust['end_date'], errors='coerce')
    df_cust['Start_date'] = pd.to_datetime(df_cust['Start_date'], errors='coerce')
    active = df_cust[df_cust['end_date'] > pd.Timestamp.now()].copy()
    print(f"\nActive customers to import: {len(active)}")
    print("="*60)

    # Build email -> customer_id map
    email_to_id = {}

    for _, row in active.iterrows():
        print(f"\n[CUSTOMER] {row['subscribers']}")
        cid = upsert_customer(row)
        if cid:
            email = str(row['email']).strip().lower()
            email_to_id[email] = cid

    print(f"\n\n{'='*60}")
    print(f"Importing transactions...")
    print(f"Total orders in DealOrder.G: {len(df_orders)}")

    # Group orders by email and insert
    for email, customer_id in email_to_id.items():
        # Match orders by email (case insensitive)
        cust_orders = df_orders[df_orders['Email'].str.strip().str.lower() == email]
        if len(cust_orders) > 0:
            print(f"\n  {email} -> {len(cust_orders)} orders")
            insert_transactions(customer_id, cust_orders)
        else:
            print(f"\n  {email} -> no orders found in DealOrder.G")

    print("\n✅ Import complete!")
    print(f"Customers imported: {len(email_to_id)}")

if __name__ == "__main__":
    main()
