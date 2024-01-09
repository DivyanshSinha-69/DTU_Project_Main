// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Placement: [],
};

export const UserPlacement = createSlice({
  name: "placement",
  initialState,
  reducers: {
    setPlacement: (state, action) => {
      state.Placement = action.payload;
    },
   
    addPlacement: (state, action) => {
      const newPlacement = [...state.Placement, action.payload];
      state.Placement = newPlacement;
    },
    deletePlacement: (state, action) => {
      const updatedPlacement = state.Placement.filter((placement) => {
        return placement.ID !== action.payload.ID;
      });

      state.Placement = updatedPlacement;
    },
    
    removePlacement: (state, action) => {
      state.Placement = [];
    },
  },
});

export const {
  setPlacement,
  deletePlacement,

  removePlacement,
  addPlacement,
} = UserPlacement.actions;

export default UserPlacement.reducer;
