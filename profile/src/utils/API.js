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
  return state.auth.role || "student"; // Default to 'student' if role not set
};

// Response interceptor: catch 401/403, refresh, then retry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // only handle 401/403 once per request
    if (
      response &&
      (response.status === 401 || response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const currentRole = getCurrentRole();
        // Use raw axios to avoid recursion into this interceptor
        axios
          .post(
            `${BACKEND}/ece/${currentRole}/refresh`,
            {},
            { withCredentials: true }
          )
          .then(() => {
            isRefreshing = false;
            onRefreshed();
          })
          .catch((refreshError) => {
            isRefreshing = false;
            subscribers = [];
            store.dispatch(logout());
          });
      }

      // return a promise that will retry the original request
      return new Promise((resolve, reject) => {
        addSubscriber(() => {
          API(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    // all other errors
    return Promise.reject(error);
  }
);

export default API;
