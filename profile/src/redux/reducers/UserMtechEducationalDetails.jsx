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
