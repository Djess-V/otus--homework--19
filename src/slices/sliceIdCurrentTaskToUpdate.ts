import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = "";

const idCurrentTaskToUpdateSlice = createSlice({
  name: "idCurrentTaskToUpdate",
  initialState,
  reducers: {
    changeId: (state, action: PayloadAction<string>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { changeId } = idCurrentTaskToUpdateSlice.actions;

export default idCurrentTaskToUpdateSlice.reducer;
