// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  EntrepreneurDetails: [],
};

export const UserEntrepreneurDetails = createSlice({
  name: "EntrepreneurDetails",
  initialState,
  reducers: {
    setEntrepreneurDetails: (state, action) => {
      state.EntrepreneurDetails = action.payload;
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

    removeEntrepreneurDetails: (state, action) => {
      state.EntrepreneurDetails = [];
    },
  },
});

export const {
  setEntrepreneurDetails,
  //   deletePlacement,

  removeEntrepreneurDetails,
  //   addPlacement,
} = UserEntrepreneurDetails.actions;

export default UserEntrepreneurDetails.reducer;
