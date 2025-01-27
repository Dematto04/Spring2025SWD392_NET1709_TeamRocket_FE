import { createSlice } from "@reduxjs/toolkit";
// const user = JSON.parse(localStorage.getItem('user'))
// const userToken = JSON.parse(localStorage.getItem('userToken'))
const initialState = {
  user: null,
  userToken: {
    refreshToken: null,
    accessToken: null,
  },
  isAuth: false
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.userToken = action.payload.userToken
      state.isAuth = true
    },
    logout: (state, action) => {
      state.user = null;
      state.refreshToken = null;
      state.accessToken = null;
      state.isAuth = false
    },
  },
});
export const selectUser = (state) => state.auth.user
export const isUserAuth = (state) => state.auth.isAuth
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
