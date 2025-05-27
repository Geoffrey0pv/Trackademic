import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/",  // Aquí defines la URL base
  // Si usas autenticación con cookies:
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;