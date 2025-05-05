import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(sessionStorage.getItem("user")) || null,
  isAuthenticated: sessionStorage.getItem("isAuthenticated") || false,
  darkMode: localStorage.getItem("darkMode") || false, // UI preference stays in localStorage
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Store non-sensitive data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      sessionStorage.setItem("isAuthenticated", "true");
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Clear all storage
      sessionStorage.clear();
      localStorage.removeItem("role");

      // Note: Cookies will be cleared by backend via HTTP response
    },
    updateUnreadCirculars: (state) => {
      if (state.user && state.user.unreadCirculars > 0) {
        state.user.unreadCirculars = 0;
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    decreaseUnreadDuties: (state) => {
      if (state.user && state.user.unreadDuties > 0) {
        state.user.unreadDuties -= 1;
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateUnreadCirculars, decreaseUnreadDuties } =
  authSlice.actions;
export default authSlice.reducer;
