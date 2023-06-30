import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slices/sliceTask";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
