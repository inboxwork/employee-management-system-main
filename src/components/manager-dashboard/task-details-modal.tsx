"use client";
import { fetchSingleTask, updateTaskStatusAndSubmission } from "@/redux/API/tasksAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

interface Props {
  showViewTask: boolean;
  selectedTask: string;
  setShowViewTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDetailsModal = ({ selectedTask, setShowViewTask, showViewTask }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
  const { task } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchSingleTask(selectedTask));
  }, [dispatch, selectedTask]);
  if (!task) return;
  return (
    (showViewTask && task) && (
      <div id="taskModal" className={`modal ${showViewTask && "show"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="modalTaskTitle">{t("modalTaskTitle")}</h2>
            <button
              className="close-modal"
              onClick={() => setShowViewTask(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="details-grid">
              <div className="detail-item">
                <strong id="detailManager">{t("detailManager")}:</strong>
                <span id="modalTaskManager" style={{ display: "block" }}>
                  {task.assignedBy}
                </span>
              </div>
              <div className="detail-item">
                <strong id="detailEmployee">{t("detailEmployee")}</strong>
                <span id="modalTaskEmployee">{task.assignedTo?.name}</span>
              </div>
              <div className="detail-item">
                <strong id="detailStartDate">{t("detailStartDate")}</strong>
                <span id="modalTaskStartDate">{task.startDate}</span>
              </div>
              <div className="detail-item">
                <strong id="detailEndDate">{t("detailEndDate")}</strong>
                <span id="modalTaskEndDate">{task.endDate}</span>
              </div>
              <div className="detail-item">
                <strong id="detailPriority">{t("detailPriority")}</strong>
                <span id="modalTaskPriority">
                  {task.priority?.toLowerCase()}
                </span>
              </div>
              <div className="detail-item">
                <strong id="detailStatus">{t("detailStatus")}</strong>
                <span id="modalTaskStatus">{task.status?.toLowerCase()}</span>
              </div>
              <div className="detail-item">
                <strong id="detailProgress">{t("detailProgress")}</strong>
                <span id="modalTaskProgress">{task.progress}%</span>
              </div>
              <div className="detail-item">
                <strong id="detailPrice">{t("detailPrice")}</strong>
                <span id="modalTaskPrice">
                  {task.price} {task.currency}
                </span>
              </div>
            </div>

            <h3 id="descriptionTitle">{t("descriptionTitle")}</h3>
            <p id="modalTaskDescription">{task.description}</p>

            {/* <!-- ✅ قسم العمل المُسلم من الموظف --> */}
            <div className="employee-work-section" id="employeeWorkSection">
              <h4>
                <i className="fas fa-user-check"></i>{" "}
                <span id="employeeSubmittedWorkTitle">
                  {t("employeeSubmittedWorkTitle")}
                </span>
              </h4>
              <div id="employeeWorkContent">{task.comment}</div>
              <div className="attachments-grid">
                {task.attachments &&
                  task.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      className="auto-open-btn"
                      href={
                        typeof attachment === "string"
                          ? attachment
                          : "url" in attachment
                            ? attachment.url
                            : ""
                      }
                      download={
                        typeof attachment === "string"
                          ? attachment
                          : "url" in attachment
                            ? attachment.url
                            : ""
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-external-link-alt"></i>{" "}
                      <span id="openAllEmployeeFilesBtn">
                        {typeof attachment === "string"
                          ? attachment
                          : "url" in attachment
                            ? attachment.url.split("/")[
                                attachment.url.split("/").length - 1
                              ]
                            : ""}
                      </span>
                    </a>
                  ))}
              </div>
            </div>

            <h3>{currentLanguage === "en" ? "Old Files: " : "الملفات السابقة: "}</h3>
            <div className="attachments-grid">
              {task?.submittedWorks?.[0]?.attachments &&
                task?.submittedWorks?.[0]?.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    className="auto-open-btn"
                    href={
                      typeof attachment === "string"
                        ? attachment
                        : "url" in attachment
                          ? attachment.url
                          : ""
                    }
                    download={
                      typeof attachment === "string"
                        ? attachment
                        : "url" in attachment
                          ? attachment.url
                          : ""
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt"></i>{" "}
                    <span id="openAllEmployeeFilesBtn">
                      {typeof attachment === "string"
                        ? attachment
                        : "url" in attachment
                          ? attachment.url.split("/")[
                              attachment.url.split("/").length - 1
                            ]
                          : ""}
                    </span>
                  </a>
                ))}
            </div>

            <div className="status-update-buttons" id="statusUpdateButtons">
              <h3>{currentLanguage === "en" ? "Update Status" : "تحديث حالة المهمة"}</h3>
            <div className="status-update-buttons">
            <button className="status-btn pending"onClick={() => dispatch(updateTaskStatusAndSubmission(task.id, "PENDING", t("statusUpdatePending")))}>
                {t("statusPending")}
            </button>
            <button className="status-btn in-progress" onClick={() => dispatch(updateTaskStatusAndSubmission(task.id, "IN_PROGRESS", t("statusUpdateInProgress")))}>
                {t("statusInProgress")}
            </button>
            <button className="status-btn completed" onClick={() => dispatch(updateTaskStatusAndSubmission(task.id, "COMPLETED", t("statusUpdateCompleted")))}>
                {t("statusCompleted")}
            </button>
            <button className="status-btn under-review" onClick={() => dispatch(updateTaskStatusAndSubmission(task.id, "UNDER_REVIEW", t("statusUpdateUnderReview")))}>
                {t("statusUnderReview")}
            </button>
        </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              id="cancelBtn"
              onClick={() => setShowViewTask(false)}
            >
              <i className="fas fa-times"></i>
              <span>{t("cancelBtn")}</span>
            </button>
            {/* <!-- تم إزالة زر Reassign Task هنا --> */}
          </div>
        </div>
      </div>
    )
  );
};

export default TaskDetailsModal;
