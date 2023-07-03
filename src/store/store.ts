import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slices/sliceTask";
import onlyCompletedReducer from "../slices/sliceOnlyCompleted";
import idCurrentTaskToUpdateReducer from "../slices/sliceIdCurrentTaskToUpdate";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    onlyCompleted: onlyCompletedReducer,
    idCurrentTaskToUpdate: idCurrentTaskToUpdateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
