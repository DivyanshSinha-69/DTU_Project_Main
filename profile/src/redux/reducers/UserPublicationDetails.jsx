// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PublicationDetails: [],
};

export const UserPublicationDetails = createSlice({
  name: "publicationDetails",
  initialState,
  reducers: {
    setPublicationDetails: (state, action) => {
      state.PublicationDetails = action.payload;
    },
   
    addPublicationDetails: (state, action) => {
      const newPublicationDetails = [...state.PublicationDetails, action.payload];
      state.PublicationDetails = newPublicationDetails;
    },
    deletePublicationDetails: (state, action) => {
      const updatedPublicationDetails = state.PublicationDetails.filter((publicationDetails) => {
        return publicationDetails.ID !== action.payload.ID;
      });

      state.PublicationDetails = updatedPublicationDetails;
    },
    
    removePublicationDetails: (state, action) => {
      state.PublicationDetails = [];
    },
  },
});

export const {
  setPublicationDetails,
  deletePublicationDetails,

  removePublicationDetails,
  addPublicationDetails,
} = UserPublicationDetails.actions;

export default UserPublicationDetails.reducer;
