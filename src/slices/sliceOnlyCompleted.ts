import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const onlyCompletedSlice = createSlice({
  name: "onlyCompleted",
  initialState,
  reducers: {
    toggle: (state) => {
      return !state;
    },
  },
});

export const { toggle } = onlyCompletedSlice.actions;

export default onlyCompletedSlice.reducer;
