from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# --- 1. INITIALIZE FASTAPI ---
app = FastAPI(title="Cosmic Weather Insurance AI")

# --- 2. LOAD MODEL AND SCALER AT STARTUP ---
try:
    model = tf.keras.models.load_model('../saved_models/kp_forecaster.h5')
    df_for_scaling = pd.read_pickle('../data/preprocessed_data.pkl')
    feature_columns = [
        'Scalar_B_nT', 'Bz_GSE_nT',
        'SW_Plasma_Temperature_K',
        'SW_Proton_Density_n_cm^3',
        'SW_Plasma_Speed_km_s',
        'Kp_index'
    ]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(df_for_scaling[feature_columns])
    print("Model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    model = None
    scaler = None

# --- 3. HELPER FUNCTIONS ---
def get_rule_based_summary(kp_index, last_hour_data):
    # Determine G-scale
    if kp_index >= 9:
        g_scale = "G5 (Extreme)"
    elif kp_index >= 8:
        g_scale = "G4 (Severe)"
    elif kp_index >= 7:
        g_scale = "G3 (Strong)"
    elif kp_index >= 6:
        g_scale = "G2 (Moderate)"
    elif kp_index >= 5:
        g_scale = "G1 (Minor)"
    else:
        g_scale = "Above quiet levels"

    bz_direction = "southward" if last_hour_data[1] < 0 else "northward"
    solar_wind_speed = last_hour_data[4]

    # Main risk driver logic
    if abs(last_hour_data[1]) > 3 and solar_wind_speed > 600:
        primary_driver = "Very strong, fast solar wind with pronounced southward Bz"
    elif abs(last_hour_data[1]) > 2:
        primary_driver = "Pronounced " + bz_direction + " Bz"
    elif solar_wind_speed > 600:
        primary_driver = "High solar wind speed"
    else:
        primary_driver = bz_direction + " Bz with moderate wind speed"

    # Compose rule-based risk summary
    return (
        f"Predicted Kp-index is {kp_index:.2f} ({g_scale}) with risk mainly driven by {primary_driver} "
        f"(wind: {solar_wind_speed:.0f} km/s, Bz: {bz_direction})."
    )

def calculate_premium(kp_index, asset_value):
    if kp_index < 5:
        prob_anomaly = 0.001
    elif kp_index < 6:
        prob_anomaly = 0.01
    elif kp_index < 7:
        prob_anomaly = 0.05
    elif kp_index < 8:
        prob_anomaly = 0.15
    else:
        prob_anomaly = 0.30

    expected_loss = asset_value * prob_anomaly
    premium = expected_loss * 1.10
    return {
        "probability_of_anomaly": prob_anomaly,
        "expected_loss": round(expected_loss, 2),
        "insurance_premium": round(premium, 2)
    }

# --- 4. API INPUT MODEL ---
class PredictionInput(BaseModel):
    asset_value: float
    hours_of_data: list[list[float]]

# --- 5. API ENDPOINTS ---
@app.post("/predict")
def predict_risk(input_data: PredictionInput):
    if model is None or scaler is None:
        return {"error": "Model not loaded. Please check server logs."}

    try:
        input_array = np.array(input_data.hours_of_data)

        if input_array.shape[1] != 5:
            return {"error": f"Invalid input. Expected 5 features per hour, but got {input_array.shape[1]}."}

        placeholder_kp = np.zeros((input_array.shape[0], 1))
        data_with_placeholder = np.hstack([input_array, placeholder_kp])

        scaled_input = scaler.transform(data_with_placeholder)
        scaled_features = scaled_input[:, :-1]

        reshaped_input = np.reshape(scaled_features, (1, scaled_features.shape[0], scaled_features.shape[1]))

        prediction_scaled = model.predict(reshaped_input)

        dummy_for_inverse = np.zeros((1, scaler.n_features_in_))
        dummy_for_inverse[0, -1] = prediction_scaled[0, 0]
        prediction_actual = scaler.inverse_transform(dummy_for_inverse)[0, -1]

        predicted_kp = float(prediction_actual)

        premium_details = calculate_premium(predicted_kp, input_data.asset_value)
        summary = get_rule_based_summary(predicted_kp, input_array[-1])

        return {
            "predicted_kp_index": round(predicted_kp, 2),
            "summary": summary,
            **premium_details
        }
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}

@app.get("/")
async def root():
    return {"message": "Cosmic Weather AI Insurance API is running!"}
