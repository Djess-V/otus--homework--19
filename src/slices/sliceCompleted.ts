import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const completedSlice = createSlice({
  name: "completed",
  initialState,
  reducers: {
    toggle: (state) => {
      return !state;
    },
  },
});

export const { toggle } = completedSlice.actions;

export default completedSlice.reducer;
