// UserAssociationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  associations: [], // Array to store user associations
};

export const UserAssociation = createSlice({
  name: "userAssociation",
  initialState,
  reducers: {
    setUserAssociations: (state, action) => {
      state.associations = action.payload; // Set the associations array
    },
    updateUserAssociation: (state, action) => {
      const updatedAssociation = action.payload;
      const index = state.associations.findIndex(
        (association) =>
          association.faculty_id === updatedAssociation.faculty_id,
      );
      if (index !== -1) {
        state.associations[index] = updatedAssociation; // Update the specific association by faculty_id
      }
    },
  },
});

export const { setUserAssociations, updateUserAssociation } =
  UserAssociation.actions;

export default UserAssociation.reducer;
