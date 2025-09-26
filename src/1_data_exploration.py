# ai_model/src/1_data_exploration.py

import pandas as pd
import numpy as np

def explore_data():
    """
    This function loads, cleans, and prints information about the space weather data.
    """
    # 1. Load the Data
    # The script is inside src/, so we go up one level ('../') to find the data folder
    file_path = '../data/omni_data.lst' 

    column_names = [
        'Year', 'Day', 'Hour', 'Scalar_B_nT', 'Bz_GSE_nT',
        'SW_Plasma_Temperature_K', 'SW_Proton_Density_n_cm^3',
        'SW_Plasma_Speed_km_s', 'Kp_index'
    ]

    df = pd.read_csv(
        file_path,
        names=column_names,
        delim_whitespace=True,
        header=None
    )
    print("--- Data Loaded Successfully ---")
    print(df.head())
    print("\n")


    # 2. Clean the Data
    df.replace({
        'Scalar_B_nT': 999.9,
        'Bz_GSE_nT': 999.9,
        'SW_Plasma_Temperature_K': 9999999.0,
        'SW_Proton_Density_n_cm^3': 999.9,
        'SW_Plasma_Speed_km_s': 9999.0
    }, np.nan, inplace=True)

    print("--- Missing values per column after cleaning ---")
    print(df.isnull().sum())
    print("\n")
    
    print("--- First 5 rows of cleaned data ---")
    print(df.head())


# This line makes the script runnable
if __name__ == "__main__":
    explore_data()