import { createSlice } from "@reduxjs/toolkit";

//account
const initialAccountState = {
  email: null,
  password: null,
};

const housekeeperRegisterSlice = createSlice({
  name: "housekeeperRegister",
  initialState: initialAccountState,
  reducers: {
    housekeeperRegister: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
  },
});

// register profile
const initialProfileState = {
  profile: null,
  cv: null,
};
const housekeeperRegisterProfileSlice = createSlice({
  name: "housekeeperRegisterProfile",
  initialState: initialProfileState,
  reducers: {
    registerProfile: (state, action) => {
      state.profile = action.payload;
    },
    registerCV: (state, action) => {
      state.cv = action.payload;
    },
  },
});
export const selectUser = (state) => {
  return {
    email: state.housekeeperRegister.email,
    password: state.housekeeperRegister.password,
  };
};
export const selectRegisterProfile = (state) => {
  return state.housekeeperRegisterProfile.profile;
};
export const selectEmail = (state) => {
  return state.housekeeperRegister.email;
};
export const { housekeeperRegister } = housekeeperRegisterSlice.actions;
export const { registerCV, registerProfile } =
  housekeeperRegisterProfileSlice.actions;
export const housekeeperRegisterProfileReducer =
  housekeeperRegisterProfileSlice.reducer;
export default housekeeperRegisterSlice.reducer;
