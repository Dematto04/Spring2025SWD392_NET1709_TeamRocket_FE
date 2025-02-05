import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  email: null,
  password: null,
};

const housekeeperRegisterSlice = createSlice({
  name: "housekeeperRegister",
  initialState,
  reducers: {
    housekeeperRegister: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
  },
});
export const selectUser = (state) => {
    return {
        email: state.housekeeperRegister.email,
        password: state.housekeeperRegister.password,
    }
}
export const { housekeeperRegister } = housekeeperRegisterSlice.actions;
export default housekeeperRegisterSlice.reducer;
