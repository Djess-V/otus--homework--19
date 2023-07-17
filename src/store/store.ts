import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slices/sliceTask";
import completedReducer from "../slices/sliceCompleted";
import searchReducer from "../slices/sliceSearch";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    completed: completedReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const selectTask = (state: RootState) =>
  state.tasks.filter((item) => {
    if (state.completed) {
      return item.status === state.completed;
    }

    return true;
  });
