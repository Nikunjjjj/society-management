import { configureStore } from "@reduxjs/toolkit";
import { someApi } from "./ApiService";


const store = configureStore({
    reducer:{
        [someApi.reducerPath] : someApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(someApi.middleware),
})

export default store