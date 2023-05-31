import { configureStore } from "@reduxjs/toolkit";
import { articleApi } from "./article";

// Create the Redux store using configureStore from "@reduxjs/toolkit"
export const store = configureStore({
  reducer: {
    // Add the reducer for the articleApi slice to the store
    [articleApi.reducerPath]: articleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Add the middleware for handling API requests to the default middleware
    getDefaultMiddleware().concat(articleApi.middleware),
});
