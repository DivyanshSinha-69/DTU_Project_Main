// UserPersonalDetails.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: null,
};

export const UserImage = createSlice({
  name: "userImage",
  initialState,
  reducers: {
    setUserImage: (state, action) => {
      state.image = action.payload;
    },
    removeUserImage: (state,action) => {
        state.image = null;
    }
  },
});



export const {
  setUserImage,
    removeUserImage

} = UserImage.actions;

export default UserImage.reducer;
