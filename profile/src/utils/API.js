import axios from "axios";
import { store } from "../redux/Store";
import { updateAccessToken, logout } from "../redux/reducers/AuthSlice";

const API = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // Ensure cookies are sent if used for refresh tokens
});
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1]; // Get the payload part of the token
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)); // Decode the base64 payload
    return payload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true; // Assume expired if no expiry time

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return payload.exp < currentTime; // Check if expiry time is in the past
};
// 🔹 Attach Access Token to Every Request
API.interceptors.request.use(
  async (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      // Check if the token is expired or about to expire (e.g., within 5 minutes)
      const isExpired = isTokenExpired(token);

      if (isExpired) {
        console.log("🔴 Token expired or about to expire. Refreshing token...");

        try {
          const refreshToken = store.getState().auth.refreshToken;

          if (!refreshToken) {
            console.error("❌ No refresh token available!");
            store.dispatch(logout());
            return Promise.reject(new Error("No refresh token available"));
          }

          // Refresh the token
          const res = await axios.post(
            "http://localhost:3001/ece/facultyauth/refresh",
            {
              refreshToken: refreshToken,
            },
          );

          if (res.status === 200) {
            const newAccessToken = res.data.accessToken;
            store.dispatch(updateAccessToken(newAccessToken));

            // Update the Authorization header with the new token
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
        } catch (refreshError) {
          console.error("🔴 Failed to refresh token:", refreshError);
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      } else {
        // Token is still valid, attach it to the request
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      console.warn("⚠️ No token found in Redux store!");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🔹 Handle Expired Token (401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("❌ API Error Status:", error.response?.status);
    console.log("❌ API Error Data:", error.response?.data);

    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const state = store.getState();
      console.log(
        "🔍 Refresh Token Before Refresh Request:",
        state.auth.refreshToken,
      );

      try {
        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
          console.error("❌ No refresh token available!");
          store.dispatch(logout());
          return Promise.reject(error);
        }

        const res = await axios.post(
          "http://localhost:3001/ece/facultyauth/refresh",
          {
            refreshToken: refreshToken, // 🔹 Send stored refresh token
          },
        );

        console.log("🔹 New Access Token Response:", res.data);

        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;

          store.dispatch(updateAccessToken(newAccessToken));

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("🔴 Refresh token expired or invalid:", refreshError);
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  },
);

export default API;
