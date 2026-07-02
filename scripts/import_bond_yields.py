import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

def get_supabase_client() -> Client:
    # Load .env.local from project root
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

def import_bond_yields_from_csv(csv_path: str):
    print(f"Reading CSV from {csv_path}...")
    try:
        from collections import defaultdict
        
        data_by_date = defaultdict(dict)
        
        with open(csv_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
            # Skip header
            for line in lines[1:]:
                cols = line.strip().split(';')
                
                # Mappings: (date_col, yield_col, maturity)
                mappings = [
                    (0, 1, '10y'),
                    (3, 4, '5y'),
                    (6, 7, '30y'),
                    (9, 10, '3y'),
                    (12, 13, '15y')
                ]
                
                for date_idx, yield_idx, maturity in mappings:
                    if len(cols) > yield_idx:
                        d_str = cols[date_idx].strip()
                        y_str = cols[yield_idx].strip()
                        
                        if d_str and y_str:
                            try:
                                parts = d_str.split('/')
                                if len(parts) == 3:
                                    m, d, y = parts
                                    if len(y) == 2:
                                        y = '20' + y
                                    parsed_date = f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
                                    parsed_yield = float(y_str.replace(',', '.'))
                                    data_by_date[parsed_date][maturity] = parsed_yield
                            except Exception as e:
                                pass
        
        supabase = get_supabase_client()
        
        records = []
        for date, yields in data_by_date.items():
            record = {
                "date": date,
                "yield_3y": yields.get('3y', None),
                "yield_5y": yields.get('5y', None),
                "yield_10y": yields.get('10y', None)
            }
            records.append(record)
            
        print(f"Prepared {len(records)} records for insertion/upsertion.")
        
        batch_size = 100
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            response = supabase.table('bond_yields').upsert(batch).execute()
            print(f"Upserted batch {i//batch_size + 1}")
            
        print("Import completed successfully!")
            
    except Exception as e:
        print(f"Error importing CSV: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Import Bond Yields CSV to Supabase")
    parser.add_argument("csv_path", help="Path to the CSV file containing bond yield data")
    args = parser.parse_args()
    
    if os.path.exists(args.csv_path):
        import_bond_yields_from_csv(args.csv_path)
    else:
        print(f"File not found: {args.csv_path}")
