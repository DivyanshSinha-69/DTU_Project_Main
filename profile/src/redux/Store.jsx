import {configureStore} from "@reduxjs/toolkit"
import  authSlice  from "./reducers/AuthSlice";
import UserSlice from "./reducers/UserSlice";
import UserProfessionalSkills from "./reducers/UserProfessionalSkills";
import UserPersonalDetails from "./reducers/UserPersonalDetails";
import UserImage from "./reducers/UserImage";
import UserPlacement from "./reducers/UserPlacementDetail";
import UserMtechEducationalDetails from "./reducers/UserMtechEducationalDetails";
import UserEntrepreneurDetails from "./reducers/UserEntrepreneurDetails";

export const store=configureStore({

    reducer:{
        auth:authSlice,
        user:UserSlice,
        userImage:UserImage,
        professionalSkills:UserProfessionalSkills,
        personalDetails:UserPersonalDetails,
        placement:UserPlacement,
        mtechEducation:UserMtechEducationalDetails,
        entrepreneurDetails:UserEntrepreneurDetails
    },
});

// export const store;
