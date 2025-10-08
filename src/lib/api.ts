import axios from "axios";
import { auth } from "./firebase";

export const api = axios.create({
  baseURL: "/api",
});

// 🔹 Interceptor que adiciona o token do Firebase antes de cada request
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
