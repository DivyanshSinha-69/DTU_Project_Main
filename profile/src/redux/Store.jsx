import {configureStore} from "@reduxjs/toolkit"
import  authSlice  from "./reducers/AuthSlice";
import UserSlice from "./reducers/UserSlice";
import UserProfessionalSkills from "./reducers/UserProfessionalSkills";
export const store=configureStore({
    reducer:{
        auth:authSlice,
        user:UserSlice,
        professionalSkills:UserProfessionalSkills,
    },
});

// export const store;