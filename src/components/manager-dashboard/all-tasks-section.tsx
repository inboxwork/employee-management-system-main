"use client";
import { deleteTask, fetchTasks } from "@/redux/API/tasksAPI";
import { getAllUsersData } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { tasksActions } from "@/redux/slices/tasksSlice";
import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { TabsNavigationTypes } from "@/utils/types";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TasksNotifications from "../tasks-notifications";

interface Props {
  currentTab: TabsNavigationTypes;
  setShowNewTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowViewTask: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReAssignTask: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<string>>;
}

const AllTasksSection = ({ currentTab, setShowNewTaskModal, setSelectedTask, setShowViewTask, setShowReAssignTask }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
  const { tasks } = useAppSelector((state) => state.tasks);
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [taskStatusFilter, setTaskStatusFilter] = useState("all");
  const [usersFilter, setUsersFilter] = useState("all");
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => !task.archived).filter((task) => {
      const matchesStatus =
        taskStatusFilter === "all" || task.status === taskStatusFilter;
      const matchesUser = usersFilter === "all" || task.userId === usersFilter;
      return matchesStatus && matchesUser;
    });
  }, [taskStatusFilter, tasks, usersFilter]);
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(getAllUsersData());
  }, [dispatch]);
  const handleDelete = async (taskId: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    await dispatch(deleteTask(taskId));
  }
  const archiveTask = async (taskId: string) => {
    if (!confirm(t("archiveConfirm"))) return;
    try {
      toast.info(currentLanguage === "en" ? "Archiving The Task" : "جاري أرشفة المهمة");
      const { data } = await axios.put(`${DOMAIN}/api/tasks/archive/${taskId}`, { archived: true });
      dispatch(tasksActions.updateTaskData(data));
      toast.success(currentLanguage === "en" ? "Task Archived Succefully" : "تم أرشفة المهمة بنجاح");
    } catch (error) {
      handleRequestError(error, currentLanguage ==="en" ? "An error occured during archive task": "حدث خطأ أثناء أرشفة المهمة");
    }
  }
  return (
    currentTab === "all-tasks" && (
      <>
        <TasksNotifications tasks={tasks}/>
        <div
        id="all-tasks"
        className={`section ${currentTab === "all-tasks" && "active"}`}
      >
        <div className="section-header">
          <h2>
            <i className="fas fa-tasks"></i>{" "}
            <span id="allTasksTitle">{t("allTasksTitle")}</span>
          </h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div className="filter-controls">
              <select
                id="taskFilter"
                className="filter-select"
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
              >
                <option value="all" id="filterAll">
                  {t("filterAll")}
                </option>
                <option value="PENDING" id="filterPending">
                  {t("filterPending")}
                </option>
                <option value="IN_PROGRESS" id="filterInProgress">
                  {t("filterInProgress")}
                </option>
                <option value="COMPLETED" id="filterCompleted">
                  {t("filterCompleted")}
                </option>
                <option value="UNDER_REVIEW" id="filterReview">
                  {t("filterReview")}
                </option>
              </select>
              <select
                id="userFilter"
                className="filter-select"
                value={usersFilter}
                onChange={(e) => setUsersFilter(e.target.value)}
              >
                <option value="all" id="filterAllUsers">
                  {t("filterAllUsers")}
                </option>
                {users &&
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              className="new-task-btn"
              onClick={() => {
                setShowNewTaskModal(true);
              }}
            >
              <i className="fas fa-plus"></i>
              <span id="newTaskBtn">{t("newTaskBtn")}</span>
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th id="taskNameHeader">{t("taskNameHeader")}</th>
                <th id="assignedByHeader">{t("assignedByHeader")}</th>
                <th id="assignedToHeader">{t("assignedToHeader")}</th>
                <th id="startDateHeader">{t("startDateHeader")}</th>
                <th id="endDateHeader">{t("endDateHeader")}</th>
                <th id="priorityHeader">{t("priorityHeader")}</th>
                <th id="statusHeader">{t("statusHeader")}</th>
                <th id="actionsHeader">{t("actionsHeader")}</th>
              </tr>
            </thead>
            <tbody id="allTasksTable">
              {tasks.length < 1 &&
                taskStatusFilter === "all" &&
                usersFilter === "all" && (
                  <tr>
                    <td colSpan={8}>
                      <div className="empty-state">
                        <i className="fas fa-tasks"></i>
                        <h3>{t("noTasksFound")}</h3>
                        <p>{t("noTasksFoundDescription")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              {tasks.length > 0 && filteredTasks.length < 1 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <i className="fas fa-tasks"></i>
                      <h3>No Matching Tasks</h3>
                      <p>No tasks match your current filters.</p>
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
                      {/* ${workBadge}
                      ${priceBadge} */}
                      <div className="task-description">
                        {task.description
                          ? task.description.substring(0, 80) + "..."
                          : "No description"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge badge-${'manager'}`}
                        style={{ padding: "6px 12px" }}
                      >
                        {task.assignedBy}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge badge-${task.assignedTo?.role?.toLowerCase() || 'employee'}`}
                        style={{ padding: "6px 12px", textAlign: "center", minWidth: "140px" }}
                      >
                        {task.assignedTo?.name}
                      </div>
                    </td>
                    <td style={{ fontWeight: "500", color: "#475569", minWidth: "160px" }}>
                      {task.startDate || "Not set"}
                    </td>
                    <td style={{ fontWeight: "500", color: "#475569", minWidth: "160px" }}>
                      {task.endDate || "Not set"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${task.priority.toLowerCase()}`}
                      >
                        {t(
                          `priority${(task.priority.toLowerCase() || "medium").charAt(0).toUpperCase() + (task.priority.toLowerCase() || "medium").slice(1)}`,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${task.status.toLowerCase().replace("_", "-") || 'pending'}`} style={{textAlign: "center", minWidth: "120px"}}>
                        {t(
                          `status${(task.status.toLowerCase() || "pending")
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join("")}`,
                        )}
                      </span>
                      {task.status === "IN_PROGRESS" && (
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" onClick={() => {
                          setSelectedTask(task.id);
                          setShowViewTask(true);
                        }}>
                          <i className="fas fa-eye"></i> {t("actionView")}
                        </button>
                        <button className="action-btn reassign" onClick={() => {
                          setSelectedTask(task.id);
                          setShowReAssignTask(true);
                        }}>
                          <i className="fas fa-exchange-alt"></i>
                          {t("actionReassign")}
                        </button>
                        <button className="action-btn archive" onClick={() => archiveTask(task.id)}>
                          <i className="fas fa-archive"></i>{" "}
                          {t("actionArchive")}
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(task.id)}>
                          <i className="fas fa-trash"></i> {t("actionDelete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
    )
  );
};

export default AllTasksSection;
