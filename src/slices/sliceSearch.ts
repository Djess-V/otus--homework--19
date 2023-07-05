import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITask } from "../api/Task";

interface ISearch {
  flag: boolean;
  value: string;
  findTasks: ITask[];
  currentTasks: ITask[];
}
const initialState: ISearch = {
  flag: false,
  value: "",
  findTasks: [],
  currentTasks: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addCurrentTasks: (state, action: PayloadAction<ITask[]>) => {
      state.currentTasks = action.payload;
      return state;
    },
    updateSearch: (
      state,
      action: PayloadAction<{ flag: boolean; value: string; tasks: ITask[] }>
    ) => {
      state.flag = action.payload.flag;
      state.value = action.payload.value;
      state.findTasks = action.payload.tasks;
      return state;
    },
    deleteTaskBySearch: (state, action: PayloadAction<string>) => {
      state.findTasks = state.findTasks.filter(
        (item) => item.id !== action.payload
      );
      state.currentTasks = state.currentTasks.filter(
        (item) => item.id !== action.payload
      );
      return state;
    },
    clearSearch: (state) => {
      state = {
        flag: false,
        value: "",
        findTasks: [],
        currentTasks: [],
      };
      return state;
    },
  },
});

export const {
  updateSearch,
  clearSearch,
  addCurrentTasks,
  deleteTaskBySearch,
} = searchSlice.actions;

export default searchSlice.reducer;
