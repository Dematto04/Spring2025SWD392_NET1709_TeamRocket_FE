import { createSlice } from "@reduxjs/toolkit";
// const user = JSON.parse(localStorage.getItem('user'))
// const userToken = JSON.parse(localStorage.getItem('userToken'))
const initialState = {
  user: null,
  userToken: {
    refreshToken: null,
    accessToken: null,
  },
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.userToken = action.payload.userToken
    },
    logout: (state, action) => {
      state.user = null;
      state.refreshToken = null;
      state.accessToken = null;
    },
  },
});
export const selectUser = (state) => state.auth.user
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
