import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
  facultyId: null, // Add facultyId to store faculty login ID
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = userSlice.actions;

export default userSlice.reducer;
