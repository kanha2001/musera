// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  withCredentials: true,
});

export default API;
