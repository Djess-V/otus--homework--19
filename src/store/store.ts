import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slices/sliceTask";
import onlyCompletedReducer from "../slices/sliceOnlyCompleted";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    onlyCompleted: onlyCompletedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
