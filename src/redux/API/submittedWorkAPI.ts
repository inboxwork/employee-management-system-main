import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { submittedWorksActions } from "../slices/submittedWorkSlice";

export function fetchAllSubmittedWork() {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/submitted-work`);
      dispatch(submittedWorksActions.setSubmittedWorks(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على بيانات المهام");
    }
  };
}

export function getSubmittedWorkCount() {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/submitted-work/count`);
      dispatch(submittedWorksActions.setSubmittedWorksCount(data.count));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على عدد المهام");
    }
  };
}

export function fetchSingleSubmittedWork(taskId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/submitted-work/${taskId}`);
      dispatch(submittedWorksActions.setSubmittedWork(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على بيانات المهمة");
    }
  };
}

export function deleteSubmittedWork(taskId: string) {
  return async (dispatch: Dispatch) => {
    try {
      toast.info("جاري حذف المهمة...");
      const { data } = await axios.delete(`${DOMAIN}/api/submitted-work/${taskId}`);
      dispatch(submittedWorksActions.deleteSubmittedWork(taskId));
      toast.success(data.message);
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء حذف بيانات المهمة");
    }
  };
}
