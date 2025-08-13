import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { sendbypassApi } from "@/services/base";
import { notificationCenter } from "@/store/middlewares/notificationCenter";
import authSlice from "@/store/slices/authSlice";
import cookieConsentReducer from "@/store/slices/cookieConsentSlice";

const reducers = combineReducers({
  [sendbypassApi.reducerPath]: sendbypassApi.reducer,
  cookieConsent: cookieConsentReducer,
  auth: authSlice,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sendbypassApi.middleware, notificationCenter),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
