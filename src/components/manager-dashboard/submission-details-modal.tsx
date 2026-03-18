import { useTranslations } from "next-intl";

const SubmissionDetailsModal = () => {
  const t = useTranslations("managerDashboardPage");
  return (
    <div id="submissionModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modalSubmissionTitle">{t("modalSubmissionTitle")}</h2>
          {/* onclick="closeSubmissionModal()" */}
          <button className="close-modal">&times;</button>
        </div>
        <div className="modal-body">
          <div className="submission-info">
            <div className="submission-header">
              <div>
                <strong id="submissionTaskName">
                  {t("submissionTaskName")}
                </strong>
                <span id="modalSubmissionTask">--</span>
              </div>
              <div
                className="badge badge-under-review"
                id="modalSubmissionStatus"
              >
                {t("modalSubmissionStatus")}
              </div>
            </div>
            <div className="submission-meta">
              <div>
                <strong id="submissionByLabel">
                  {t("modalSubmissionStatus")}
                </strong>
                <span id="modalSubmissionBy">--</span>
              </div>
              <div>
                <strong id="submissionToLabel">{t("submissionToLabel")}</strong>
                <span id="modalSubmissionTo">--</span>
              </div>
              <div>
                <strong id="submissionDateLabel">{t("submissionDateLabel")}</strong>
                <span id="modalSubmissionDate">--</span>
              </div>
            </div>
            <div className="submission-files" id="modalSubmissionFiles">
              {/* <!-- Submission files will be populated by JavaScript --> */}
            </div>
          </div>

          {/* <!-- ✅ تم إزالة قسم التعليقات هنا --> */}
          <h3 id="commentsTitle">{t("commentsTitle")}</h3>

          <div className="attachments-grid" id="modalSubmissionAttachments">
            {/* <!-- Submission attachments will be populated by JavaScript --> */}
          </div>

          {/* <!-- Auto Open Button for Submission Files --> */}
          {/* onclick="autoOpenSubmissionFiles()" */}
          <button className="auto-open-btn">
            <i className="fas fa-external-link-alt"></i>
            <span id="autoOpenSubmissionBtn">{t("autoOpenSubmissionBtn")}</span>
          </button>
        </div>
        <div className="modal-footer">
          {/* onclick="closeSubmissionModal()" */}
          <button
            type="button"
            className="btn-secondary"
            id="closeSubmissionBtn"
          >
            <i className="fas fa-times"></i>
            <span>{t("closeSubmissionBtn")}</span>
          </button>
          {/* onclick="deleteSubmission()" */}
          <button
            type="button"
            className="btn-primary"
            id="deleteSubmissionBtn"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            <i className="fas fa-trash"></i>
            <span>{t("deleteSubmissionBtn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;
