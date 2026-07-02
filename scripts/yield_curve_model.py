import os
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
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

def fetch_bond_yields(supabase: Client) -> pd.DataFrame:
    print("Fetching bond yields from Supabase...")
    # Fetch all records, assuming the dataset is not extremely large
    # For production, we should paginate if the dataset exceeds 1000 rows
    response = supabase.table('bond_yields').select('*').order('date', desc=False).execute()
    
    if not response.data:
        print("No bond yield data found in database.")
        return pd.DataFrame()
        
    df = pd.DataFrame(response.data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.set_index('date')
    
    # Select only the yield columns
    yield_cols = ['yield_1y', 'yield_2y', 'yield_3y', 'yield_5y', 'yield_10y']
    existing_cols = [col for col in yield_cols if col in df.columns]
    df = df[existing_cols]
    
    # Drop columns that are completely empty
    df = df.dropna(axis=1, how='all')
    
    # Then drop rows that have any missing data in the remaining columns
    df = df.dropna()
    return df

def extract_yield_curve_factors(df: pd.DataFrame) -> pd.DataFrame:
    print("Running PCA to extract Yield Curve Factors...")
    # Initialize PCA with 3 components
    pca = PCA(n_components=3)
    
    # Standardize the data before PCA (optional but recommended for yields if variances differ widely)
    # Actually, for yield curves, sometimes covariance matrix is used directly to preserve scale.
    # We will use covariance matrix (no standardization) as standard in ATSM literature, 
    # since all variables are in the same unit (percentage).
    factors = pca.fit_transform(df)
    
    # Explain variance
    explained_variance = pca.explained_variance_ratio_ * 100
    print(f"Explained Variance: PC1 (Level): {explained_variance[0]:.2f}%, "
          f"PC2 (Slope): {explained_variance[1]:.2f}%, "
          f"PC3 (Curvature): {explained_variance[2]:.2f}%")
          
    # Ensure standard interpretation of factors
    # Level should be positively correlated with all yields.
    if np.mean(pca.components_[0]) < 0:
        factors[:, 0] = -factors[:, 0]
        
    # Slope is typically long-term minus short-term. 
    # We want PC2 to positively correlate with the slope (10Y - 1Y).
    empirical_slope = df.iloc[:, -1] - df.iloc[:, 0]
    if np.corrcoef(factors[:, 1], empirical_slope)[0, 1] < 0:
        factors[:, 1] = -factors[:, 1]
        
    # Create a DataFrame for the factors
    factors_df = pd.DataFrame(
        factors, 
        columns=['level', 'slope', 'curvature'],
        index=df.index
    )
    
    # Determine Risk Signal
    # Risk-On if Slope > 0 (Upward sloping) and Level is stable or decreasing
    # Risk-Off if Slope <= 0 (Flat or Inverted)
    
    factors_df['risk_signal'] = np.where(
        factors_df['slope'] <= 0, 
        'Risk-Off', 
        'Risk-On'
    )
    
    # Let's add a more nuanced signal: Neutral if slope is positive but very small
    slope_threshold = factors_df['slope'].quantile(0.2) # Bottom 20% of positive slopes
    factors_df.loc[(factors_df['slope'] > 0) & (factors_df['slope'] < slope_threshold), 'risk_signal'] = 'Neutral'
    
    return factors_df

def save_factors_to_supabase(supabase: Client, factors_df: pd.DataFrame):
    print("Saving factors back to Supabase...")
    records = []
    
    # Reset index to get 'date' as a column
    factors_df = factors_df.reset_index()
    factors_df['date'] = factors_df['date'].dt.strftime('%Y-%m-%d')
    
    for _, row in factors_df.iterrows():
        record = {
            "date": row['date'],
            "level": float(row['level']),
            "slope": float(row['slope']),
            "curvature": float(row['curvature']),
            "risk_signal": row['risk_signal']
        }
        records.append(record)
        
    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        try:
            supabase.table('yield_curve_factors').upsert(batch).execute()
        except Exception as e:
            print(f"Error upserting batch {i//batch_size + 1}: {e}")
            
    print(f"Successfully saved {len(records)} factor records.")

def main():
    supabase = get_supabase_client()
    df = fetch_bond_yields(supabase)
    
    if df.empty:
        print("Cannot proceed without bond yield data.")
        return
        
    factors_df = extract_yield_curve_factors(df)
    
    # Print the most recent signal
    latest = factors_df.iloc[-1]
    print(f"\n--- LATEST YIELD CURVE SIGNAL ({latest.name.strftime('%Y-%m-%d')}) ---")
    print(f"Level: {latest['level']:.4f}")
    print(f"Slope: {latest['slope']:.4f}")
    print(f"Curvature: {latest['curvature']:.4f}")
    print(f"Risk Signal: {latest['risk_signal']}")
    print("------------------------------------------\n")
    
    save_factors_to_supabase(supabase, factors_df)

if __name__ == "__main__":
    main()
