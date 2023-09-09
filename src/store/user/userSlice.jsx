import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.current = action.payload.current;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.token = null;
      state.current = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
