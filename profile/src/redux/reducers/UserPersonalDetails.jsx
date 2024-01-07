// UserPersonalDetails.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PersonalDetails: [],
};

export const UserPersonalDetails = createSlice({
  name: "personalDetails",
  initialState,
  reducers: {
    setPersonalDetails: (state, action) => {
      state.PersonalDetails = action.payload;
    },

    updatePersonalDetails: (state, action) => {
      state.PersonalDetails = action.payload;
    },
    

    removePersonalDetails: (state, action) => {
        state.PersonalDetails = [];
    },
  },
});



export const {
  setPersonalDetails,
  removePersonalDetails,
  updatePersonalDetails,

} = UserPersonalDetails.actions;

export default UserPersonalDetails.reducer;
