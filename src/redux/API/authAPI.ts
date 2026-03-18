import { Dispatch } from "@reduxjs/toolkit";
import { authActions } from "../slices/authSlice";
import { JWTPayload } from "@/utils/types";

export function logoutUser() {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("userInfo");
  };
}

export function loginUser(data: JWTPayload) {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.login(data));
    localStorage.setItem("userInfo", JSON.stringify(data));
  };
}
