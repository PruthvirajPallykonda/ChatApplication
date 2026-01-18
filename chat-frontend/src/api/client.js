import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://chatapplication-production-48d0.up.railway.app";

const client = axios.create({
  baseURL: API_BASE + "/api",
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("chatUser");
  if (stored) {
    try {
    const user = JSON.parse(stored);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {}

}  
  return config;
});

export default client;
