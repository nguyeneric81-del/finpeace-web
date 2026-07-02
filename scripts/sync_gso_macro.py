import os
import io
import sys
import json
import zipfile
import requests
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
env_path = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local'
load_dotenv(env_path)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase environment variables not found in .env.local")
    sys.exit(1)

# Seeding definitions
CATEGORIES = {
    1: {"name": "Tài khoản quốc gia (GDP)", "description": "Dữ liệu GDP và tài khoản quốc gia"},
    2: {"name": "Chỉ số giá và lạm phát", "description": "Dữ liệu CPI và chỉ số giá tiêu dùng"},
    5: {"name": "Sản xuất công nghiệp", "description": "Dữ liệu IIP và sản xuất công nghiệp"}
}

INDICATORS = {
    "NGDP_R_PA_XDC": {
        "category_id": 1,
        "name": "Tổng sản phẩm quốc nội (GDP thực tế)",
        "unit": "Tỷ VNĐ (2010)",
        "frequency": "Q"
    },
    "PCPI_IX": {
        "category_id": 2,
        "name": "Chỉ số giá tiêu dùng (CPI)",
        "unit": "Chỉ số (2019=100)",
        "frequency": "M"
    },
    "AIP_ISIC4_IX": {
        "category_id": 5,
        "name": "Chỉ số sản xuất công nghiệp (IIP)",
        "unit": "Chỉ số (2018=100)",
        "frequency": "M"
    }
}

NSO_LINKS = {
    "NGDP_R_PA_XDC": "http://nsdp.nso.gov.vn/GSO-chung/Tu%E1%BA%A5n%20Anh/excel%20chung/GDP_VNM.xlsx",
    "PCPI_IX": "http://nsdp.nso.gov.vn/GSO-chung/Tu%E1%BA%A5n%20Anh/excel%20chung/CPI_VNM.xlsx",
    "AIP_ISIC4_IX": "http://nsdp.nso.gov.vn/GSO-chung/Tu%E1%BA%A5n%20Anh/excel%20chung/IIP_VNM.xlsx"
}

def seed_metadata(supabase):
    print("=== Seeding Metadata (Categories & Indicators) ===")
    
    # 1. Seed Categories
    for cat_id, cat_info in CATEGORIES.items():
        res = supabase.table("macro_categories").select("id").eq("id", cat_id).execute()
        if not res.data:
            supabase.table("macro_categories").insert({
                "id": cat_id,
                "name": cat_info["name"],
                "description": cat_info["description"]
            }).execute()
            print(f"  [+] Seeded category: {cat_info['name']}")
        else:
            print(f"  [.] Category exists: {cat_info['name']}")
            
    # 2. Seed Indicators
    for ind_id, ind_info in INDICATORS.items():
        payload = {
            "id": ind_id,
            "category_id": ind_info["category_id"],
            "name": ind_info["name"],
            "unit": ind_info["unit"],
            "frequency": ind_info["frequency"]
        }
        res = supabase.table("macro_indicators").select("id").eq("id", ind_id).execute()
        if not res.data:
            supabase.table("macro_indicators").insert(payload).execute()
            print(f"  [+] Seeded indicator: {ind_info['name']}")
        else:
            supabase.table("macro_indicators").update(payload).eq("id", ind_id).execute()
            print(f"  [+] Updated indicator: {ind_info['name']}")

def parse_nso_sheet(content: bytes, sheet_name: str) -> pd.DataFrame:
    xl = pd.ExcelFile(io.BytesIO(content))
    raw = xl.parse(sheet_name, header=None)

    # locate the header row (contains 'INDICATOR' or 'Country code')
    header_row = None
    for i, row in raw.iterrows():
        if row.astype(str).str.contains("INDICATOR|Country code", na=False).any():
            header_row = i
            break
    if header_row is None:
        raise ValueError(f"Could not find header row in sheet '{sheet_name}'")

    header = raw.iloc[header_row]

    # period columns
    period_cols = []
    for col_idx, val in enumerate(header):
        s = str(val)
        if "-" in s and s[:4].isdigit():
            period_cols.append((col_idx, s))

    data_start = header_row + 2
    data_rows = []

    for _, row in raw.iloc[data_start:].iterrows():
        indicator = str(row.iloc[0]).strip()
        if indicator in ("nan", "", "NaN"):
            continue
        descriptor    = str(row.iloc[1]).strip()
        descriptor_vn = str(row.iloc[3]).strip()
        freq          = str(row.iloc[4]).strip()
        base_per      = str(row.iloc[5]).strip()

        values = {}
        for col_idx, period in period_cols:
            val = row.iloc[col_idx]
            try:
                values[period] = float(val)
            except (TypeError, ValueError):
                values[period] = float("nan")

        data_rows.append({
            "indicator":     indicator,
            "descriptor":    descriptor,
            "descriptor_vn": descriptor_vn,
            "freq":          freq,
            "base_per":      base_per,
            **values,
        })

    return pd.DataFrame(data_rows)

def parse_excel_direct(indicator, content):
    xl = pd.ExcelFile(io.BytesIO(content))
    sheets = xl.sheet_names
    target_freq = INDICATORS[indicator]["frequency"]
    
    sheet_name = None
    if target_freq == "Q":
        sheet_name = "Dataset_Q" if "Dataset_Q" in sheets else sheets[0]
    elif target_freq == "M":
        sheet_name = "Dataset_M" if "Dataset_M" in sheets else sheets[0]
    else:
        sheet_name = sheets[0]
        
    print(f"Parsing sheet {sheet_name} for indicator {indicator}...")
    df = parse_nso_sheet(content, sheet_name)
    
    row = df[df["indicator"] == indicator]
    if row.empty:
        raise KeyError(f"Indicator '{indicator}' not found in Excel sheet.")
        
    meta_cols = ["indicator", "descriptor", "descriptor_vn", "freq", "base_per"]
    period_data = row.drop(columns=meta_cols, errors="ignore").iloc[0]
    
    data_list = []
    for period, val in period_data.items():
        try:
            val_float = float(val)
            if not pd.isna(val_float):
                data_list.append((str(period), val_float))
        except:
            pass
            
    return sorted(data_list, key=lambda x: x[0])

def fetch_archive_fallback():
    url = "https://github.com/thanhqtran/gso-macro-monitor/releases/download/v1.2.0/all_data_gso_20250606.json.zip"
    print(f"Fallback: Downloading GSO archive database from {url}...")
    res = requests.get(url, timeout=30)
    res.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(res.content)) as z:
        for name in z.namelist():
            if name.endswith(".json"):
                data_bytes = z.read(name)
                return json.loads(data_bytes.decode('utf-8'))
    raise ValueError("No JSON file found in GSO archive zip.")

def parse_archive_data(archive_json, indicator):
    target_freq = INDICATORS[indicator]["frequency"]
    data_list = []
    
    for sublist in archive_json:
        if isinstance(sublist, list):
            for item in sublist:
                if isinstance(item, dict):
                    ind = item.get("@INDICATOR")
                    if ind == indicator:
                        freq = item.get("@FREQ")
                        if freq == target_freq:
                            obs = item.get("Obs", [])
                            for ob in obs:
                                period = ob.get("@TIME_PERIOD")
                                val_str = ob.get("@OBS_VALUE")
                                try:
                                    val = float(val_str)
                                    data_list.append((period, val))
                                except:
                                    pass
    return sorted(data_list, key=lambda x: x[0])

def calculate_growth_rates(data_list, frequency):
    val_map = {period: val for period, val in data_list}
    results = []
    
    for period, val in data_list:
        yoy_growth = None
        mom_growth = None
        
        # Calculate YoY
        try:
            parts = period.split("-")
            year = int(parts[0])
            suffix = parts[1]
            prev_year_period = f"{year - 1}-{suffix}"
            if prev_year_period in val_map and val_map[prev_year_period] > 0:
                yoy_growth = ((val / val_map[prev_year_period]) - 1) * 100
        except:
            pass
            
        # Calculate MoM / QoQ
        try:
            parts = period.split("-")
            year = int(parts[0])
            suffix = parts[1]
            prev_period = None
            
            if frequency == "Q":
                q_num = int(suffix[1])
                if q_num == 1:
                    prev_period = f"{year - 1}-Q4"
                else:
                    prev_period = f"{year}-Q{q_num - 1}"
            elif frequency == "M":
                m_num = int(suffix)
                if m_num == 1:
                    prev_period = f"{year - 1}-12"
                else:
                    prev_period = f"{year}-{m_num - 1:02d}"
                    
            if prev_period in val_map and val_map[prev_period] > 0:
                mom_growth = ((val / val_map[prev_period]) - 1) * 100
        except:
            pass
            
        results.append({
            "period": period,
            "value": val,
            "yoy_growth": yoy_growth,
            "mom_growth": mom_growth
        })
        
    return results

def upsert_macro_data(supabase, indicator_id, frequency, parsed_data):
    print(f"=== Upserting macro data for {indicator_id} ===")
    period_type = "quarter" if frequency == "Q" else "month"
    
    # Calculate rates
    growth_data = calculate_growth_rates(parsed_data, frequency)
    print(f"  Processed {len(growth_data)} data points chronologically.")
    
    success_count = 0
    for item in growth_data:
        period = item["period"]
        val = item["value"]
        yoy = item["yoy_growth"]
        mom = item["mom_growth"]
        
        # Look for existing record
        res = supabase.table("macro_data")\
            .select("id")\
            .eq("indicator_id", indicator_id)\
            .eq("period_type", period_type)\
            .eq("period_value", period)\
            .execute()
            
        payload = {
            "indicator_id": indicator_id,
            "period_type": period_type,
            "period_value": period,
            "value": val,
            "yoy_growth": yoy,
            "mom_growth": mom
        }
        
        try:
            if res.data:
                record_id = res.data[0]["id"]
                supabase.table("macro_data").update(payload).eq("id", record_id).execute()
            else:
                supabase.table("macro_data").insert(payload).execute()
            success_count += 1
        except Exception as e:
            print(f"  [!] Error upserting period {period}: {e}")
            
    print(f"  [+] Done. Successfully upserted {success_count}/{len(growth_data)} points.")

def main():
    print("Connecting to Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Seed metadata tables first
    seed_metadata(supabase)
    
    archive_json = None
    
    for indicator, url in NSO_LINKS.items():
        print(f"\n--- Processing indicator: {indicator} ---")
        parsed_data = None
        
        # Attempt Source 1: Direct Excel download
        try:
            print(f"Downloading Excel from GSO: {url} ...")
            # Cache file locally under data/
            os.makedirs("data", exist_ok=True)
            filename = os.path.join("data", url.split("/")[-1])
            
            # Send HTTP request with 10s timeout
            r = requests.get(url, timeout=10)
            r.raise_for_status()
            with open(filename, "wb") as f:
                f.write(r.content)
            print(f"  Excel file saved to {filename}")
            
            # Parse Excel
            parsed_data = parse_excel_direct(indicator, r.content)
            print(f"  Successfully parsed {len(parsed_data)} points from Excel.")
            
        except Exception as e:
            print(f"  [!] Direct GSO Excel download failed: {type(e).__name__} - {e}")
            
            # Attempt Source 2: Archive JSON Fallback
            if archive_json is None:
                try:
                    archive_json = fetch_archive_fallback()
                except Exception as ex:
                    print(f"  [!!] Failed to fetch GSO archive fallback: {ex}")
                    continue
            
            try:
                parsed_data = parse_archive_data(archive_json, indicator)
                print(f"  Successfully parsed {len(parsed_data)} points from GSO archive.")
            except Exception as ex:
                print(f"  [!!] Failed to parse GSO archive data for {indicator}: {ex}")
                continue
                
        if parsed_data:
            upsert_macro_data(supabase, indicator, INDICATORS[indicator]["frequency"], parsed_data)
            
    print("\n=== Macro Sync Pipeline Completed Successfully ===")

if __name__ == "__main__":
    main()
