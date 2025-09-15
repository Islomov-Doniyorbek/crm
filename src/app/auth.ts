import axios, { InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./api";

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const api = axios.create({
  baseURL: "https://fast-simple-crm.onrender.com/api/v1",
});

// Tokenni subscribe qilish
function subscribeTokenRefresh(cb: (token: string) => void) {
  subscribers.push(cb);
}

// Refresh tugagach, hammani yangilash
function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

// ✅ config tipini InternalAxiosRequestConfig qilib qo‘yamiz
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && !(config as any)._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            onRefreshed(newToken); // kutib turganlarni yangilash
          }
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          (config as any)._retry = true;
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          resolve(api(config));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
