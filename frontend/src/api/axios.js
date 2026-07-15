import axios from "axios";

const api = axios.create({
  baseURL: "https://realestate-mern-7c6k.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ghar360_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
