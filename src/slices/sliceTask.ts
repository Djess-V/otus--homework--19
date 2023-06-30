import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITask {
  id: string;
  text: string;
  status: boolean;
  createdAt: Date;
  tags: string[];
}

const initialState: ITask[] = [
  {
    id: "task1",
    text: "Hello, World!",
    status: true,
    createdAt: new Date(),
    tags: ["foo", "boo"],
  },
  {
    id: "task2",
    text: "Bye, Bob!",
    status: false,
    createdAt: new Date(),
    tags: ["foo", "boo"],
  },
  {
    id: "task3",
    text: "Hello, Greg!",
    status: true,
    createdAt: new Date(),
    tags: [],
  },
];

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ITask>) => {
      state.push(action.payload);
      return state;
    },

    removeTask: (state, action: PayloadAction<string>) =>
      state.filter((task) => task.id !== action.payload),
  },
});

export const { addTask, removeTask } = taskSlice.actions;

export default taskSlice.reducer;
