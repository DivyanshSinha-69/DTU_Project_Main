// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  MtechEducation: [],
};

export const UserMtechEducationalDetails = createSlice({
  name: "MtechEducation",
  initialState,
  reducers: {
    setMtechEducation: (state, action) => {
      state.MtechEducation = action.payload;
    },
  
    removeMtechEducation: (state, action) => {
      state.MtechEducation = [];
    },
  },
});

export const {
  setMtechEducation,
//   deletePlacement,

removeMtechEducation
//   addPlacement,
} = UserMtechEducationalDetails.actions;

export default UserMtechEducationalDetails.reducer;
