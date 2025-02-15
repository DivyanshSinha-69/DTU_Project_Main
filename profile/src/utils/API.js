import axios from "axios";
import { store } from "../redux/Store";
import { updateAccessToken, logout } from "../redux/reducers/AuthSlice";

const API = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // Ensure cookies are sent if used for refresh tokens
});
// 🔹 Attach Access Token to Every Request
API.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    
    console.log("🔍 Redux Auth State:", store.getState().auth);
    console.log("🔹 API Request URL:", config.url);
    console.log("🔹 Token Attached to Request:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found in Redux store!");
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🔹 Handle Expired Token (401 Unauthorized)
API.interceptors.response.use(
  (response) => response, 
  async (error) => {
    console.log("❌ API Error Status:", error.response?.status);
    console.log("❌ API Error Data:", error.response?.data);

    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; 
      const state = store.getState();
      console.log("🔍 Refresh Token Before Refresh Request:", state.auth.refreshToken);

      try {
        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
          console.error("❌ No refresh token available!");
          store.dispatch(logout());
          return Promise.reject(error);
        }

        const res = await axios.post("http://localhost:3001/ece/facultyauth/refresh", {
          refreshToken: refreshToken, // 🔹 Send stored refresh token
        });

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
  }
);



export default API;
