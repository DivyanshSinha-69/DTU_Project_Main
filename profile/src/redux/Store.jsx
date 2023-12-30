import {configureStore} from "@reduxjs/toolkit"
import  authSlice  from "./reducers/AuthSlice";
import UserSlice from "./reducers/UserSlice";
export const store=configureStore({
    reducer:{
        auth:authSlice,
        user:UserSlice,
    },
});

// export const store;