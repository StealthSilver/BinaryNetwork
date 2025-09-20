import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducer/authReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// TypeScript types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
