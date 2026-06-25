// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://imarikafoundation.org/api/api/", // your Django backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
