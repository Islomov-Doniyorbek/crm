import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // cookie yuboriladi
});

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  // Backend accessToken qaytaradi, refresh esa cookie'da bo'ladi
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data;
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh");
  return res.data.accessToken; // yangi access token
}

export async function logout() {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
}
