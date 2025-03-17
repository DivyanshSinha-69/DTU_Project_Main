import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Ensure structure is maintained
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: localStorage.getItem("isAuthenticated") || false,
  darkMode: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.facultyId = action.payload.facultyId;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuthenticated", state.isAuthenticated);

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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("darkMode");
      localStorage.removeItem("role");
    },
    updateAccessToken: (state, action) => {
      console.log("🔄 Updating Access Token in Redux:", action.payload);
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    updateUnreadCirculars: (state) => {
      if (state.user && state.user.unreadCirculars > 0) {
        state.user.unreadCirculars = 0; //Set to 0
        localStorage.setItem("user", JSON.stringify(state.user)); // Update localStorage
      }
    },
    decreaseUnreadDuties: (state) => {
      if (state.user && state.user.unreadDuties > 0) {
        state.user.unreadDuties -= 1; // Decrease unreadDuties by 1
        localStorage.setItem("user", JSON.stringify(state.user)); // Update localStorage
      }
    },
  },
});

export const {
  login,
  logout,
  updateAccessToken,
  updateUnreadCirculars,
  decreaseUnreadDuties,
} = authSlice.actions;
export default authSlice.reducer;
