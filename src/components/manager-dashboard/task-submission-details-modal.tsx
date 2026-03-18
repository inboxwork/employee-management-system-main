"use client";
import { SubmittedWork } from "@/utils/types";
import { useTranslations } from "next-intl";

interface Props {
  selectedSubmission: Partial<SubmittedWork>;
  showSubmission: boolean;
  setShowSubmission: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskSubmissionDetailsModal = ({selectedSubmission, setShowSubmission, showSubmission}: Props) => {
  const t = useTranslations("managerDashboardPage");

  return (showSubmission && selectedSubmission) && (
      <div id="taskModal" className={`modal ${showSubmission && "show"}`}>
        <div className="modal-content">
          <div className="modal-header">
          <h2 id="modalTaskTitle">{selectedSubmission.title}</h2>
            <button
              className="close-modal"
              onClick={() => setShowSubmission(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="details-grid">
              <div className="detail-item">
                <strong id="detailManager">{t("detailManager")}:</strong>
                <span id="modalTaskManager" style={{ display: "block" }}>
                  {selectedSubmission.fromEmployee}
                </span>
              </div>
              <div className="detail-item">
                <strong id="detailEmployee">{t("detailEmployee")}</strong>
                <span id="modalTaskEmployee">{selectedSubmission?.toEmployee?.name}</span>
              </div>
              <div className="detail-item">
                <strong id="detailStartDate">{t("detailStartDate")}</strong>
                <span id="modalTaskStartDate">{selectedSubmission.startDate}</span>
              </div>
              <div className="detail-item">
                <strong id="detailEndDate">{t("detailEndDate")}</strong>
                <span id="modalTaskEndDate">{selectedSubmission.endDate}</span>
              </div>
              <div className="detail-item">
                <strong id="detailPriority">{t("detailPriority")}</strong>
                <span id="modalTaskPriority">
                  {selectedSubmission.priority?.toLowerCase()}
                </span>
              </div>
              <div className="detail-item">
                <strong id="detailStatus">{t("detailStatus")}</strong>
                <span id="modalTaskStatus">{selectedSubmission.status?.toLowerCase().replace("_", "-")}</span>
              </div>
              <div className="detail-item">
                <strong id="detailProgress">{t("detailProgress")}</strong>
                <span id="modalTaskProgress">{selectedSubmission.progress}%</span>
              </div>
              <div className="detail-item">
                <strong id="detailPrice">{t("detailPrice")}</strong>
                <span id="modalTaskPrice">
                  {selectedSubmission.price} {selectedSubmission.currency}
                </span>
              </div>
            </div>

            <h3 id="descriptionTitle">{t("descriptionTitle")}</h3>
            <p id="modalTaskDescription">{selectedSubmission.description}</p>

            {/* <!-- ✅ قسم العمل المُسلم من الموظف --> */}
            <div className="employee-work-section" id="employeeWorkSection">
              <h4>
                <i className="fas fa-user-check"></i>{" "}
                <span id="employeeSubmittedWorkTitle">
                  {t("employeeSubmittedWorkTitle")}
                </span>
              </h4>
              <div id="employeeWorkContent">{selectedSubmission.comment}</div>
              <div className="attachments-grid">
                {selectedSubmission.attachments &&
                  selectedSubmission.attachments.map((attachment, index) => (
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
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              id="cancelBtn"
              onClick={() => setShowSubmission(false)}
            >
              <i className="fas fa-times"></i>
              <span>{t("cancelBtn")}</span>
            </button>
            {/* <!-- تم إزالة زر Reassign Task هنا --> */}
          </div>
        </div>
      </div>
  );
};

export default TaskSubmissionDetailsModal;
