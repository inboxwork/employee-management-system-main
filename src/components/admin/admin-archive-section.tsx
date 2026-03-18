"use client";
import { fetchTasks } from "@/redux/API/tasksAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { tasksActions } from "@/redux/slices/tasksSlice";
import { DOMAIN } from "@/utils/constants";
import { formatPriceWithCurrency } from "@/utils/formatters";
import { handleRequestError } from "@/utils/handle-errors";
import { TabsNavigationTypes } from "@/utils/types";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  currentTab: TabsNavigationTypes;
}

type TimeFilter = "today" | "week" | "month" | "all";

const ArchiveSection = ({ currentTab }: Props) => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - now.getDay());
  firstDayOfWeek.setHours(0, 0, 0, 0);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale();
  const { tasks } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => task.archived)
      .filter((task) => {
        const archivedDate = new Date(task.archivedDate);

        if (timeFilter === "today") {
          return archivedDate >= startOfDay && archivedDate <= endOfDay;
        }

        if (timeFilter === "week") {
          return (
            archivedDate >= firstDayOfWeek && archivedDate <= lastDayOfWeek
          );
        }

        if (timeFilter === "month") {
          return archivedDate >= startOfMonth && archivedDate <= endOfMonth;
        }

        return timeFilter === "all";
      });
  }, [tasks, timeFilter]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  const restoreFromArchive = async (taskId: string) => {
    if (!confirm(t("restoreConfirm"))) return;
    try {
      toast.info(
        currentLanguage === "en"
          ? "Removing The Task From Archive"
          : "جاري إلغاء أرشفة المهمة",
      );
      const { data } = await axios.put(
        `${DOMAIN}/api/tasks/archive/${taskId}`,
        { archived: false },
      );
      dispatch(tasksActions.updateTaskData(data));
      toast.success(
        currentLanguage === "en"
          ? "Task Removed From Archive Succefully"
          : "تم إلغاء المهمة بنجاح",
      );
    } catch (error) {
      handleRequestError(
        error,
        currentLanguage === "en"
          ? "An error occured during remove task from archive"
          : "حدث خطأ أثناء إلغاء أرشفة المهمة",
      );
    }
  };
  return (
    currentTab === "archive" && (
      <div
        id="archive"
        className={`section ${currentTab === "archive" && "active"}`}
      >
        <div className="section-header">
          <h2>
            <i className="fas fa-archive"></i>{" "}
            <span id="archiveTitle">{t("archiveTitle")}</span>
          </h2>
          <div className="filter-controls">
            <select
              id="archiveFilter"
              className="filter-select"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            >
              <option value="all" id="filterAllArchive">
                {t("filterAllArchive")}
              </option>
              <option value="today" id="filterTodayArchive">
                {t("filterTodayArchive")}
              </option>
              <option value="week" id="filterWeekArchive">
                {t("filterWeekArchive")}
              </option>
              <option value="month" id="filterMonthArchive">
                {t("filterMonthArchive")}
              </option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th id="archiveTaskNameHeader">{t("archiveTaskNameHeader")}</th>
                <th id="archiveEmployeeHeader">{t("archiveEmployeeHeader")}</th>
                <th id="archiveArchivedByHeader">
                  {t("archiveArchivedByHeader")}
                </th>
                <th id="archiveDateHeader">{t("archiveDateHeader")}</th>
                <th id="archiveStatusHeader">{t("archiveStatusHeader")}</th>
                <th id="archiveActionsHeader">{t("archiveActionsHeader")}</th>
              </tr>
            </thead>
            <tbody id="archiveTable">
              {filteredTasks.length < 1 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <i className="fas fa-archive"></i>
                      <h3>{t("noArchiveFound")}</h3>
                      <p>
                        {filteredTasks.length === 0
                          ? "No tasks have been archived yet."
                          : "No archived tasks match your filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredTasks &&
                filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong style={{ color: "#1e293b", fontSize: "15px" }}>
                        {task.title}
                      </strong>
                      {task.price && (
                        <div className="price-badge">
                          {formatPriceWithCurrency(task.price, task.currency)}
                        </div>
                      )}
                      <div className="task-description">
                        {task.description
                          ? task.description.substring(0, 80) + "..."
                          : ""}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge badge-${task.assignedTo?.role?.toLowerCase()}`}
                      >
                        {task.assignedTo?.name}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge badge-${"manager"}`}
                        style={{ padding: "6px 12px" }}
                      >
                        {task.archivedBy}
                      </div>
                    </td>
                    <td style={{ color: "#475569", fontWeight: 500 }}>
                      {new Date(task.archivedDate).toLocaleDateString()}
                    </td>
                    <td style={{ color: "#000" }}>
                      <div
                        className={`status-btn ${task.status?.toLowerCase().replace("_", "-")}`}
                        style={{ textAlign: "center" }}
                      >
                        {task.status?.toLowerCase().replace("_", " ")}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn restore"
                          onClick={() => restoreFromArchive(task.id)}
                        >
                          <i className="fas fa-undo"></i> {t("actionRestore")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default ArchiveSection;
