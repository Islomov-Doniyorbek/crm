import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { refreshAccessToken } from "./api";

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const api = axios.create({
  baseURL: "https://fast-simple-crm.onrender.com/api/v1",
});

// 🔑 Custom config turi (_retry qo‘shib)
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Tokenni subscribe qilish
function subscribeTokenRefresh(cb: (token: string) => void) {
  subscribers.push(cb);
}

// Refresh tugagach, hammani yangilash
function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

// ✅ Request interceptor
api.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const response = error.response;
    const originalConfig = error.config as CustomAxiosRequestConfig;

    if (response?.status === 401 && !originalConfig._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            onRefreshed(newToken);
          }
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalConfig._retry = true;
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalConfig));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
