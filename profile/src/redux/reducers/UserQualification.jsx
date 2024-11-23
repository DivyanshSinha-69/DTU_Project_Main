// UserQualificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  qualifications: [], // Array to store user qualifications
};

export const UserQualifications = createSlice({
  name: "userQualifications",
  initialState,
  reducers: {
    setUserQualifications: (state, action) => {
      state.qualifications = action.payload; // Set the qualifications array
    },
    addUserQualification: (state, action) => {
      state.qualifications.push(action.payload); // Add a new qualification
    },
  },
});

export const {
  setUserQualifications,
  addUserQualification,
} = UserQualifications.actions;

export default UserQualifications.reducer;
