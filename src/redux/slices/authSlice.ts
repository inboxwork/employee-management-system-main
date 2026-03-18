import { JWTPayload } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateTypes = {
  loggedInUser: null | JWTPayload;
};

const userInfo = typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;

const initialState: InitialStateTypes = {
  loggedInUser: userInfo ? JSON.parse(userInfo!) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.loggedInUser = action.payload;
    },
    setPassword(state, action) {
      state.loggedInUser!.password = action.payload.password;
    },
    logout(state) {
      state.loggedInUser = null;
    },
  },
});

const authReducer = authSlice.reducer;
const authActions = authSlice.actions;

export { authActions, authReducer };
