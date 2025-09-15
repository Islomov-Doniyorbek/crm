import axios from "axios";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    console.log(refreshToken);
    
    const res = await axios.post(
      "https://fast-simple-crm.onrender.com/api/v1/auth/refresh",
      { refresh_token: refreshToken }, // ✅ JSON format
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = res.data;
    console.log(data);
    
    localStorage.setItem("refreshToken", data.refresh_token);
    localStorage.setItem("accessToken", data.access_token);

    return data.access_token;
  } catch (err) {
    console.error("❌ Refresh token ishlamadi:", err);
    return null;
  }
};
