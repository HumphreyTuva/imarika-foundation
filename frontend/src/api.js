// src/api.js
import axios from "axios";

const api = axios.create({

  // baseURL: "http://127.0.0.1:8080/api/", 
  baseURL: "https://imarikafoundation.org/api/api/", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
