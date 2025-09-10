import axios from "axios";

const api = axios.create({
  baseURL: "https://fast-simple-crm.onrender.com/api/v1",
  withCredentials: true,
});

// Request interceptor – access token qo‘shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – 401 bo‘lsa refresh qilish
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          "https://fast-simple-crm.onrender.com/api/v1/auth/refresh",
          { refreshToken }
        );

        // yangi access token saqlash
        localStorage.setItem("accessToken", data.accessToken);

        // headerlarni yangilash
        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.error("❌ Refresh ishlamadi:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth"; // login sahifaga
      }
    }
    return Promise.reject(error);
  }
);

export default api;
