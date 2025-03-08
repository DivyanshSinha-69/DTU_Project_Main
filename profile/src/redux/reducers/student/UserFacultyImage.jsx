// FacultyImageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: null, // Stores the faculty image (Base64 or URL)
};

export const FacultyImage = createSlice({
  name: "facultyImage",
  initialState,
  reducers: {
    setFacultyImage: (state, action) => {
      state.image = action.payload; // Update the faculty image
    },
    removeFacultyImage: (state) => {
      state.image = null; // Clear the faculty image
    },
  },
});

export const { setFacultyImage, removeFacultyImage } = FacultyImage.actions;

export default FacultyImage.reducer;
