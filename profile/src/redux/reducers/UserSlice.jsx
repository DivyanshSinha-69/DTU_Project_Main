import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: localStorage.getItem("role") || null, // Add role to store user
  facultyId: null, // Add facultyId to store faculty login ID
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export const { setRole } = userSlice.actions;

export default userSlice.reducer;
