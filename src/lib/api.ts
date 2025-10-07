import axios from "axios";
import { auth } from "./firebase";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    // força sempre pegar um token fresco
    const token = await user.getIdToken(true);
    console.log("👤 CurrentUser:", user.email);
    console.log("🔑 Token:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Nenhum usuário autenticado no interceptor");
  }

  return config;
});
