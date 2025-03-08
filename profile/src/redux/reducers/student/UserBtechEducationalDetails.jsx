// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  BtechEducation: [],
};

export const UserBtechEducationalDetails = createSlice({
  name: "BtechEducation",
  initialState,
  reducers: {
    setBtechEducation: (state, action) => {
      state.BtechEducation = action.payload;
    },

    removeBtechEducation: (state, action) => {
      state.BtechEducation = [];
    },
  },
});

export const {
  setBtechEducation,
  //   deletePlacement,

  removeBtechEducation,
  //   addPlacement,
} = UserBtechEducationalDetails.actions;

export default UserBtechEducationalDetails.reducer;
