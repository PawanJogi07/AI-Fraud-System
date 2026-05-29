from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import joblib
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "model",
    "fraud_model.pkl"
)

model = joblib.load(
    MODEL_PATH
)

@app.get("/")
def home():

    return {
        "message":
        "AI Fraud Detection API Running"
    }

@app.post("/predict")
def predict(data: dict):

    values = np.array(
        data["features"]
    ).reshape(1, -1)

    prediction = model.predict(
        values
    )[0]

    probability = model.predict_proba(
        values
    )[0]

    return {

        "prediction":
            int(prediction),

        "fraud_probability":
            float(
                probability[1]
            ),

        "safe_probability":
            float(
                probability[0]
            )

    }