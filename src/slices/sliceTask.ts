import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../api/Task";

const initialState: Task[] = [];

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    unloadTasksFromLS: (state, action: PayloadAction<Task[]>) => {
      state = action.payload;
      return state;
    },

    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
      return state;
    },

    updateTask: (
      state,
      action: PayloadAction<{ id: string; data: string | boolean }>
    ) =>
      state.map((task) => {
        if (task.id === action.payload.id) {
          const newTask = { ...task };
          if (typeof action.payload.data === "string") {
            newTask.text = action.payload.data;
          } else {
            newTask.status = action.payload.data;
          }

          return newTask;
        }
        return task;
      }),

    deleteTask: (state, action: PayloadAction<string>) =>
      state.filter((task) => task.id !== action.payload),
  },
});

export const { addTask, updateTask, deleteTask, unloadTasksFromLS } =
  taskSlice.actions;

export default taskSlice.reducer;
