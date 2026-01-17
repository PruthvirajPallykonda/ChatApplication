import axios from "axios";

const client = axios.create({
    baseURL:"https://chatapplication-production-48d0.up.railway.app/api",
    withCredentials: true,
});

// Add Authorization header if token exists
client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("chatUser");
  if (stored) {
    const user = JSON.parse(stored);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default client;