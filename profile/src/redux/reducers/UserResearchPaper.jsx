// UserResearchPaperSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  researchPapers: [], // Array to store user research papers
};

export const UserResearchPaper = createSlice({
  name: "userResearchPapers",
  initialState,
  reducers: {
    // Set the list of research papers for the user
    setUserResearchPapers: (state, action) => {
      state.researchPapers = action.payload;
    },

    // Update a research paper in the user's list
    updateUserResearchPaper: (state, action) => {
      const updatedPapers = state.researchPapers.map((paper) =>
        paper.PublicationID === action.payload.PublicationID
          ? { ...paper, ...action.payload }
          : paper,
      );
      state.researchPapers = updatedPapers;
    },

    // Delete a research paper from the user's list
    deleteUserResearchPaper: (state, action) => {
      const remainingPapers = state.researchPapers.filter(
        (paper) => paper.PublicationID !== action.payload,
      );
      state.researchPapers = remainingPapers;
    },
  },
});

// Exporting actions
export const {
  setUserResearchPapers,
  updateUserResearchPaper,
  deleteUserResearchPaper,
} = UserResearchPaper.actions;

// Exporting reducer
export default UserResearchPaper.reducer;
