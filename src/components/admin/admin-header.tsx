import { fetchTasks, getTasksCount } from "@/redux/API/tasksAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const AdminHeader = () => {
  const t = useTranslations("adminPage");
  const currentLanguage = useLocale() as "en" | "ar";
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
      <div className="admin-info">
        <div className="admin-avatar" id="adminAvatar">
          {loggedInUser.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="admin-details">
          <h1 id="adminName">{loggedInUser.name}</h1>
          <p id="adminEmail">{loggedInUser.email}</p>
        </div>
      </div>
      <div className="stats-overview">
        <h3 id="totalTasksTitle">{t("totalTasksTitle")}</h3>
        <div className="stats-count" id="totalTasksCount">
          {tasksCount}
        </div>
        <div className="stats-label" id="tasksInProgress">
          {completedTasks} {currentLanguage === "en" ? "Completed" : "مهام مكتملة"}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
