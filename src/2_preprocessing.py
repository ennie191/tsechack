# ai_model/src/2_preprocessing.py

import pandas as pd
import numpy as np

def preprocess_data():
    """
    This function loads the raw data, cleans and preprocesses it,
    and saves the result to a new file.
    """
    # --- Part 1: Load and Clean (Same as before) ---
    file_path = '../data/omni_data.lst' 
    column_names = [
        'Year', 'Day', 'Hour', 'Scalar_B_nT', 'Bz_GSE_nT',
        'SW_Plasma_Temperature_K', 'SW_Proton_Density_n_cm^3',
        'SW_Plasma_Speed_km_s', 'Kp_index'
    ]
    df = pd.read_csv(file_path, names=column_names, delim_whitespace=True, header=None)
    df.replace({
        'Scalar_B_nT': 999.9, 'Bz_GSE_nT': 999.9, 'SW_Plasma_Temperature_K': 9999999.0,
        'SW_Proton_Density_n_cm^3': 999.9, 'SW_Plasma_Speed_km_s': 9999.0
    }, np.nan, inplace=True)

    # --- Part 2: Preprocessing Steps ---

    # 1. Handle Missing Values using Linear Interpolation
    df.interpolate(inplace=True)
    print("--- Missing values after interpolation ---")
    print(df.isnull().sum())
    print("\n")

    # 2. Create a proper datetime index
    df['Timestamp'] = pd.to_datetime(df['Year'].astype(str) + '-' + df['Day'].astype(str) + '-' + df['Hour'].astype(str), format='%Y-%j-%H')
    df.set_index('Timestamp', inplace=True)
    df.drop(['Year', 'Day', 'Hour'], axis=1, inplace=True) # Drop original time columns

    # 3. Correct the Kp-index values
    df['Kp_index'] = df['Kp_index'] / 10.0

    print("--- Preprocessed data with Datetime Index ---")
    print(df.head())

    # --- Part 3: Save the Cleaned Data ---
    # Saving to a pickle file is efficient and preserves data types
    output_path = '../data/preprocessed_data.pkl'
    df.to_pickle(output_path)
    print(f"\nPreprocessed data saved to {output_path}")


if __name__ == "__main__":
    preprocess_data()