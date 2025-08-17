import { configureStore } from "@reduxjs/toolkit";
import nodeReducer from "./nodeSlice";

export const store = configureStore({
  reducer: {
    nodes: nodeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
