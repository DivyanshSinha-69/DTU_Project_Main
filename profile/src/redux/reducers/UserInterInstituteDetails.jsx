// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  InterInstitute: [],
};

export const UserInterInstituteDetials = createSlice({
  name: "interInstitute",
  initialState,
  reducers: {
    setInterInstitute: (state, action) => {
      state.InterInstitute = action.payload;
    },
   
    addInterInstitute: (state, action) => {
      const newInterInstitute = [...state.InterInstitute, action.payload];
      state.InterInstitute = newInterInstitute;
    },
    deleteInterInstitute: (state, action) => {
      const updatedInterInstitute = state.InterInstitute.filter((InterInstitute) => {
        return InterInstitute.ID !== action.payload.ID;
      });

      state.InterInstitute = updatedInterInstitute;
    },
    
    removeInterInstitute: (state, action) => {
      state.InterInstitute = [];
    },
  },
});

export const {
  setInterInstitute,
  deleteInterInstitute,

  removeInterInstitute,
  addInterInstitute,
} = UserInterInstituteDetials.actions;

export default UserInterInstituteDetials.reducer;
