import { deleteSubmittedWork, fetchAllSubmittedWork } from "@/redux/API/submittedWorkAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SubmittedWork as SubmittedWorkTypes, TabsNavigationTypes, TimeFilter } from "@/utils/types";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

interface Props {
  currentTab: TabsNavigationTypes;
  setSelectedSubmission: React.Dispatch<React.SetStateAction<Partial<SubmittedWorkTypes>>>;
  setShowSubmission: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubmittedWork = ({ currentTab, setSelectedSubmission, setShowSubmission }: Props) => {
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
  const { submittedWorks } = useAppSelector((state) => state.submittedWork);
  const dispatch = useAppDispatch();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const filteredSubmittedWorks = useMemo(() => {
    return submittedWorks.filter((task) => {
        const archivedDate = new Date(task.createdAt);

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
  }, [submittedWorks, timeFilter]);

  useEffect(() => {
    dispatch(fetchAllSubmittedWork());
  }, [dispatch]);

  function showSubmissionDetails(submission: SubmittedWorkTypes) {
    setSelectedSubmission(submission);
    setShowSubmission(true);
  }

  function handleDelete(taskId: string) {
    if (!confirm(t("deleteConfirm"))) return;
    dispatch(deleteSubmittedWork(taskId));
  }
  return (
    currentTab === "submitted-work" && (
      <div
        id="submitted-work"
        className={`section ${currentTab === "submitted-work" && "active"}`}
      >
        <div className="section-header">
          <h2>
            <i className="fas fa-paper-plane"></i>{" "}
            <span id="submittedWorkTitle">{t("submittedWorkTitle")}</span>
          </h2>
          <div className="filter-controls">
            {/* onchange="filterSubmissions()" */}
            <select id="submissionFilter" className="filter-select" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}>
              <option value="all" id="filterAllSubmissions">
                {t("filterAllSubmissions")}
              </option>
              <option value="today" id="filterToday">
                {t("filterToday")}
              </option>
              <option value="week" id="filterWeek">
                {t("filterWeek")}
              </option>
              <option value="month" id="filterMonth">
                {t("filterMonth")}
              </option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th id="submissionTaskHeader">{t("submissionTaskHeader")}</th>
                <th id="submissionEmployeeHeader">
                  {t("submissionEmployeeHeader")}
                </th>
                <th id="submissionToHeader">{t("submissionToHeader")}</th>
                <th id="submissionDateHeader">{t("submissionDateHeader")}</th>
                {/* <th id="submissionFilesHeader">{t("submissionFilesHeader")}</th> */}
                {/* <!-- تم إزالة عمود التعليقات هنا --> */}
                <th id="submissionActionsHeader">
                  {t("submissionActionsHeader")}
                </th>
              </tr>
            </thead>
            <tbody id="submittedWorkTable">
              {submittedWorks.length < 1 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <i className="fas fa-paper-plane"></i>
                      <h3>{t("noSubmissionsFound")}</h3>
                      <p>
                        {filteredSubmittedWorks.length === 0
                          ? "No work has been submitted by employees yet."
                          : "No submissions match your filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredSubmittedWorks &&
                filteredSubmittedWorks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong style={{ color: "#1e293b", fontSize: "15px" }}>
                        {task?.title}
                      </strong>
                      <br />
                      {/* <small style="color: #64748b;">ID: {submission.taskId || 'N/A'}</small> */}
                    </td>
                    <td>
                      <div className="badge badge-employee">
                        {task?.fromEmployee}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge badge-${task?.toEmployee?.role.toLowerCase()}`}
                      >
                        {task?.toEmployee?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginTop: "5px",
                        }}
                      >
                        Assigned by: {task?.assignedBy}
                      </div>
                    </td>
                    <td style={{ fontWeight: "500", color: "#475569" }}>
                      {new Date(task?.submittedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" onClick={() => showSubmissionDetails(task)}>
                          <i className="fas fa-eye"></i> {t("actionView")}
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
    )
  );
};

export default SubmittedWork;
