// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  HigherEducationDetails: [],
};

export const UserHigherEducationDetails = createSlice({
  name: "HigherEducationDetails",
  initialState,
  reducers: {
    setHigherEducationDetails: (state, action) => {
      state.HigherEducationDetails = action.payload;
    },

    // addPlacement: (state, action) => {
    //   const newPlacement = [...state.Placement, action.payload];
    //   state.Placement = newPlacement;
    // },
    // deletePlacement: (state, action) => {
    //   const updatedPlacement = state.Placement.filter((placement) => {
    //     return placement.ID !== action.payload.ID;
    //   });

    //   state.Placement = updatedPlacement;
    // },

    removeHigherEducationDetails: (state, action) => {
      state.HigherEducationDetails = [];
    },
  },
});

export const {
  setHigherEducationDetails,
  //   deletePlacement,

  removeHigherEducationDetails,
  //   addPlacement,
} = UserHigherEducationDetails.actions;

export default UserHigherEducationDetails.reducer;
