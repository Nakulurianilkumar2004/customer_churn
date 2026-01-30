import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // Your FastAPI backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to call /predict endpoint
export const predictCustomer = async (data) => {
  return API.post("/predict", data);
};
