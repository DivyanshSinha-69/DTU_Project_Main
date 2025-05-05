import axios from "axios";
import { store } from "../redux/Store";
import { logout } from "../redux/reducers/AuthSlice";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
let isRefreshing = false;
let subscribers = [];

/**
 * When refresh finishes, call all queued callbacks
 */
function onRefreshed() {
  subscribers.forEach((cb) => cb());
  subscribers = [];
}

/**
 * Queue requests until the refresh is done
 */
function addSubscriber(cb) {
  subscribers.push(cb);
}

const API = axios.create({
  baseURL: BACKEND,
  withCredentials: true, // send HttpOnly cookies
});
// Helper function to get current role from Redux store
const getCurrentRole = () => {
  const state = store.getState();
  return state.user.role || "student"; // Default to 'student' if role not set
};

// Response interceptor: catch 401/403, refresh, then retry
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

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

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              resolve(API(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const role = getCurrentRole();
        await axios.post(
          `${BACKEND}/ece/${role}/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        processQueue(null);
        return API(originalRequest); // ✅ return retried request
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // all other errors
  }
);

export default API;
