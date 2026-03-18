import { useTranslations } from "next-intl";

const AddCommentsModal = () => {
  const t = useTranslations("managerDashboardPage");
  return (
    <div id="commentsModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="commentsModalTitle">{t("commentsModalTitle")}</h2>
          {/* onclick="closeCommentsModal()" */}
          <button className="close-modal">&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="managerComments" id="commentsLabel">
              {t("commentsLabel")}
            </label>
            <textarea
              id="managerComments"
              rows={6}
              placeholder={t("managerComments")}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          {/* onclick="closeCommentsModal()" */}
          <button
            type="button"
            className="btn-secondary"
            id="cancelCommentsBtn"
          >
            <i className="fas fa-times"></i>
            <span>{t("cancelCommentsBtn")}</span>
          </button>
          {/* onclick="saveManagerComments()" */}
          <button type="button" className="btn-primary" id="saveCommentsBtn">
            <i className="fas fa-save"></i>
            <span>{t("saveCommentsBtn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCommentsModal;
