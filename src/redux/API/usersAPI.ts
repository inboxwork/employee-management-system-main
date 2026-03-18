import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { usersActions } from "../slices/usersSlice";

export function getUserProfile(userId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/users/${userId}`);
      dispatch(usersActions.setUserData(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على بيانات المستخدم");
    }
  };
}

export function getUsersCount() {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/users/count`);
      dispatch(usersActions.setUsersCount(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على عدد المستخدمين");
    }
  };
}

export function deleteUserData(userId: string) {
  return async (dispatch: Dispatch) => {
    try {
      await axios.delete(`${DOMAIN}/api/users/${userId}`);
      dispatch(usersActions.deleteUserAccount(userId));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء حذف بيانات المستخدم");
    }
  };
}

export function getAllUsersData() {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/users`);
      dispatch(usersActions.setAllUsersData(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على بيانات جميع المستخدمين");
    }
  };
}
