"use client";
import { fetchTasks, getTasksCount } from "@/redux/API/tasksAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface Props {
  setShowChangePasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenNewManagerModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManagerDashboardHeader = ({ setShowChangePasswordModal, setOpenNewManagerModal }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const { tasks, tasksCount } = useAppSelector((state) => state.tasks);
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length;
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(getTasksCount());
  }, [dispatch]);
  if (!loggedInUser) return redirect("/");
  return (
    <div className="header">
      <div className="manager-info">
        <div className="manager-avatar" id="managerAvatar">
          {loggedInUser.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="manager-details">
          <h1 id="managerName">{loggedInUser.name}</h1>
        </div>
      </div>
      <div className="header-actions">
        <button
          className="header-btn change-password-btn"
          onClick={() => setShowChangePasswordModal(true)}
        >
          <i className="fas fa-key"></i>
          <span id="">{t("changePasswordBtn")}</span>
        </button>
        <button className="header-btn new-manager-btn" onClick={() => setOpenNewManagerModal(true)}>
          <i className="fas fa-user-plus"></i>
          <span id="newManagerBtn">{t("newManagerBtn")}</span>
        </button>
      </div>

      <div className="stats-overview">
        <h3 id="totalTasksTitle">{t("totalTasksTitle")}</h3>
        <div className="stats-count" id="totalTasksCount">
          {tasksCount}
        </div>
        <div className="stats-label" id="tasksCompleted">
          {completedTasks} {t("tasksCompleted")}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardHeader;
