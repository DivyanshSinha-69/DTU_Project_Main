import axios from "axios";
import { store } from "../redux/Store";
import { updateAccessToken, logout } from "../redux/reducers/AuthSlice";
import { useSelector } from "react-redux";
// const {refreshToken, accessToken} = useSelector((state) => state.auth) || {};

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
  withCredentials: true, // Ensure cookies are sent if used for refresh tokens
});

// 🔹 Attach Access Token to Every Request
API.interceptors.request.use(
  async (config) => {
    // No need to manually attach token - it will be sent via cookies
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle Expired Token (401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token via cookie
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/ece/student/refresh-token`,
          {}, // No body needed - refresh token is in cookie
          { withCredentials: true }
        );

        if (res.status === 200) {
          // The new access token should be set in cookies by the backend
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);
export default API;
