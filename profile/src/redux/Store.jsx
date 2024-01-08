import {configureStore} from "@reduxjs/toolkit"
import  authSlice  from "./reducers/AuthSlice";
import UserSlice from "./reducers/UserSlice";
import UserProfessionalSkills from "./reducers/UserProfessionalSkills";
import UserPersonalDetails from "./reducers/UserPersonalDetails";
import UserImage from "./reducers/UserImage";

export const store=configureStore({
    reducer:{
        auth:authSlice,
        user:UserSlice,
        userImage:UserImage,
        professionalSkills:UserProfessionalSkills,
        personalDetails:UserPersonalDetails,
    },
});

// export const store;