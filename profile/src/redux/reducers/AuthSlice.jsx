import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");
let parsedUser = null;
try {
  const storedUser = localStorage.getItem("user");
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  facultyId: localStorage.getItem("facultyId") || null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};



export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("🔹 Redux Login Payload:", action.payload);
      state.user = action.payload.user;
      state.facultyId = action.payload.facultyId;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("facultyId", action.payload.facultyId);
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Store user persistently
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.facultyId = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("facultyId");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateAccessToken: (state, action) => {
      console.log("🔄 Updating Access Token in Redux:", action.payload);
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
});

export const { login, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
