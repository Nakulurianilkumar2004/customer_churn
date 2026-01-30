from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ Import CORS middleware
from pydantic import BaseModel
import pickle
import numpy as np

# ----------------------------
# Load model & scaler
# ----------------------------
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# ----------------------------
# FastAPI app
# ----------------------------
app = FastAPI(title="Customer Purchase Prediction API")

# ----------------------------
# Add CORS middleware
# ----------------------------
origins = [
    "http://localhost:5173",  # React frontend URL
    "http://127.0.0.1:3000",  # Also allow localhost IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],     # Allow GET, POST, etc.
    allow_headers=["*"],     # Allow custom headers
)

# ----------------------------
# Request schema
# ----------------------------
class CustomerData(BaseModel):
    age: int
    salary: int

# ----------------------------
# Root endpoint
# ----------------------------
@app.get("/")
def home():
    return {"message": "ML Model API is running"}

# ----------------------------
# Prediction endpoint
# ----------------------------
@app.post("/predict")
def predict(data: CustomerData):
    input_data = np.array([[data.age, data.salary]])
    input_scaled = scaler.transform(input_data)
    prediction = model.predict(input_scaled)

    if prediction[0] == 1:
        result = "Customer will buy"
    else:
        result = "Customer will not buy"

    return {
        "prediction": int(prediction[0]),
        "result": result
    }
