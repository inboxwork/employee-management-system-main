const AdminSubmessionDetailsModal = () => {
  return (
    <div id="submissionModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modalSubmissionTitle">Submission Details</h2>
          {/* onclick="closeSubmissionModal()" */}
          <button className="close-modal">&times;</button>
        </div>
        <div className="modal-body">
          <div className="submission-info">
            <div className="submission-header">
              <div>
                <strong id="submissionTaskName">Task:</strong>
                <span id="modalSubmissionTask">--</span>
              </div>
              <div
                className="badge badge-under-review"
                id="modalSubmissionStatus"
              >
                Under Review
              </div>
            </div>
            <div className="submission-meta">
              <div>
                <strong id="submissionByLabel">Submitted by:</strong>
                <span id="modalSubmissionBy">--</span>
              </div>
              <div>
                <strong id="submissionToLabel">To:</strong>
                <span id="modalSubmissionTo">--</span>
              </div>
              <div>
                <strong id="submissionDateLabel">Date:</strong>
                <span id="modalSubmissionDate">--</span>
              </div>
              <div>
                <strong id="budgetLabel">Budget:</strong>
                <span id="modalSubmissionBudget">--</span>
              </div>
            </div>
            <div className="submission-files" id="modalSubmissionFiles">
              {/* <!-- Submission files will be populated by JavaScript --> */}
            </div>
          </div>

          <h3 id="commentsTitle">Employee Comments</h3>
          <p id="modalSubmissionComments"></p>

          <div className="attachments-grid" id="modalSubmissionAttachments">
            {/* <!-- Submission attachments will be populated by JavaScript --> */}
          </div>
        </div>
        <div className="modal-footer">
          {/* onclick="closeSubmissionModal()" */}
          <button
            type="button"
            className="btn-secondary"
            id="closeSubmissionBtn"
          >
            <i className="fas fa-times"></i>
            <span>Close</span>
          </button>
          {/* onclick="downloadSubmission()" */}
          <button
            type="button"
            className="btn-primary"
            id="downloadSubmissionBtn"
          >
            <i className="fas fa-download"></i>
            <span>Download All Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmessionDetailsModal;
