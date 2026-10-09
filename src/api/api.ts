import axios from "axios";

// Set VITE_API_URL (e.g. in .env.local) to run against a local backend
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://estaterybackn.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
