import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import housekeeperRegisterReducer, {
  housekeeperRegisterProfileReducer,
} from "./features/housekeeperRegisterSlice";
import bookingReducer from "./features/bookingSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { apiSlice } from "./api/apiSlice";

const persistConfig = {
  key: "root", // Key for storage
  storage, // Using localStorage
  whitelist: ["auth", "cart", "housekeeperRegisterProfile", "booking"], // Only persist auth and cart slices
  blacklist: ["housekeeperRegister"],
};

const rootReducer = combineReducers({
  housekeeperRegister: housekeeperRegisterReducer,
  housekeeperRegisterProfile: housekeeperRegisterProfileReducer,
  auth: authReducer,
  booking: bookingReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  // cart: cartReducer,
  // profile: profileReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to avoid serializable warnings with redux-persist
    }).concat(apiSlice.middleware), // Include RTK Query middleware
});
export const persistor = persistStore(store);
