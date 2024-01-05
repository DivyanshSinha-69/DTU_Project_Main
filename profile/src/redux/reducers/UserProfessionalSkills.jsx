// UserProfessionalSkills.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ProfessionalSkills: null,
};

export const UserProfessionalSkills = createSlice({
  name: "professionalSkills",
  initialState,
  reducers: {
    setProfessionalSkills: (state, action) => {
      state.ProfessionalSkills = action.payload;
    },
    updateProfessionalSkill: (state, action) => {
      const updatedSkills = state.ProfessionalSkills.map((skill) => {
        if (skill.ID === action.payload.id) {
          return { ...skill, ...action.payload.updateddata };
        }
        return skill;
      });

      state.ProfessionalSkills = updatedSkills;
    },
    addProfessionalSkill: (state, action) => {
      const newSkills = [...state.ProfessionalSkills, action.payload];
      state.ProfessionalSkills = newSkills;
    },
    deleteProfessionalSkill: (state, action) => {
      const updatedSkills = state.ProfessionalSkills.filter((skill) => {
        return skill.ID !== action.payload.ID;
      });

      state.ProfessionalSkills = updatedSkills;
    },
    removeProfessionalSkills: (state, action) => {
      state.ProfessionalSkills = null;
    },
  },
});

export const {
  setProfessionalSkills,
  deleteProfessionalSkill,
  updateProfessionalSkill,
  removeProfessionalSkills,
  addProfessionalSkill,
} = UserProfessionalSkills.actions;

export default UserProfessionalSkills.reducer;
