import { createSlice } from "@reduxjs/toolkit";

// Load tokens from localStorage (persists across page reloads)
const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

const initialState = {
  facultyId: null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,
  isAuthenticated: !!storedAccessToken, // Set authenticated state
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("🔹 Redux Login Payload:", action.payload);
      state.facultyId = action.payload.facultyId;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // ✅ Save tokens in localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.facultyId = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // ✅ Remove tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateAccessToken: (state, action) => {
      console.log("🔄 Updating Access Token in Redux:", action.payload);
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload); // ✅ Update localStorage
    },
  },
});

export const { login, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
