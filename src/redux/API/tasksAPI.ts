import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { tasksActions } from "../slices/tasksSlice";
import { toast } from "react-toastify";
import { TaskStatus } from "@/utils/types";
import { submittedWorksActions } from "../slices/submittedWorkSlice";

export function fetchTasks() {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/tasks`);
      dispatch(tasksActions.setTasks(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على بيانات المهام");
    }
  };
}

export function getTasksCount() {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/tasks/count`);
      dispatch(tasksActions.setTasksCount(data.count));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على عدد المهام");
    }
  };
}

export function fetchSingleTask(taskId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.get(`${DOMAIN}/api/tasks/${taskId}`);
      dispatch(tasksActions.setTask(data));
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء الحصول على بيانات المهمة");
    }
  };
}

export function deleteTask(taskId: string) {
  return async (dispatch: Dispatch) => {
    try {
      toast.info("جاري حذف المهمة...");
      const { data } = await axios.delete(`${DOMAIN}/api/tasks/${taskId}`);
      dispatch(tasksActions.deleteTask(taskId));
      toast.success(data.message);
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء حذف بيانات المهمة");
    }
  };
}

export function updateTaskStatus(taskId: string, newStatus: TaskStatus, message: string) {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.put(`${DOMAIN}/api/tasks/status/${taskId}`, { status: newStatus });
      dispatch(tasksActions.updateTaskData(data.updatedTask));
      toast.success(message);
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء تحديث حالة المهمة");
    }
  }
}

export function updateTaskStatusAndSubmission(taskId: string, newStatus: TaskStatus, message: string) {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.put(`${DOMAIN}/api/tasks/status/${taskId}`, { status: newStatus });
      dispatch(tasksActions.updateTaskData(data.updatedTask));
      dispatch(submittedWorksActions.updateSubmittedWorkData(data.updatedSubmission));
      toast.success(message);
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء تحديث حالة المهمة");
    }
  }
}
