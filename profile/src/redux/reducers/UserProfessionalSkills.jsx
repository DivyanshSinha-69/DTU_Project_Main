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
    removeProfessionalSkills: (state, action) => {
      state.ProfessionalSkills = null;
    },
  },
});

export const { setProfessionalSkills, updateProfessionalSkill,removeProfessionalSkills } =
  UserProfessionalSkills.actions;

export default UserProfessionalSkills.reducer;
