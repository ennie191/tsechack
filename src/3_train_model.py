# ai_model/src/3_train_model.py

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def create_sequences(data, n_steps):
    """
    Creates sequences of historical data for the LSTM model.
    For each point in time, it takes the 'n_steps' previous hours as input
    and the current hour's Kp-index as the output.
    """
    X, y = [], []
    for i in range(n_steps, len(data)):
        X.append(data[i-n_steps:i, :-1]) # All features except the last one (Kp_index)
        y.append(data[i, -1])            # The last feature, Kp_index
    return np.array(X), np.array(y)

def train_model():
    """
    Loads preprocessed data, builds, trains, and saves the LSTM model.
    """
    # 1. Load Preprocessed Data
    data_path = '../data/preprocessed_data.pkl'
    df = pd.read_pickle(data_path)
    
    # Ensure Kp_index is the last column for the create_sequences function
    kp_col = df.pop('Kp_index')
    df['Kp_index'] = kp_col
    
    print("--- Data Loaded ---")
    print(df.head())
    
    # 2. Scale the Data
    # Neural networks work best when input values are scaled between 0 and 1.
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    # 3. Create Sequences
    # We will use the last 72 hours of data to predict the next hour.
    n_steps = 72
    X, y = create_sequences(scaled_data, n_steps)
    
    print(f"\nCreated {len(X)} sequences.")
    print("Shape of a single input sequence (X):", X[0].shape)
    print("Shape of a single output (y):", y[0].shape)

    # 4. Build the LSTM Model
    model = Sequential([
        LSTM(64, activation='tanh', input_shape=(X.shape[1], X.shape[2])),
        Dense(32, activation='relu'),
        Dense(1, activation='linear')
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.summary()

    # 5. Train the Model
    print("\n--- Starting Model Training ---")
    # We'll use a small number of epochs for the hackathon to train quickly.
    model.fit(X, y, epochs=10, batch_size=32, verbose=1)

    # 6. Save the Trained Model
    model_path = '../saved_models/kp_forecaster.h5'
    model.save(model_path)
    print(f"\n--- Model training complete. Model saved to {model_path} ---")

if __name__ == "__main__":
    train_model()