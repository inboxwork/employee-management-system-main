const AdminReassignTaskModal = () => {
  return (
    <div id="reassignModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="reassignTitle">Reassign Task</h2>
          {/* onclick="closeReassignModal()" */}
          <button className="close-modal">&times;</button>
        </div>
        <div className="modal-body">
          <div className="reassign-form">
            <div className="form-group">
              <label htmlFor="reassignToUser" id="reassignToLabel">
                Reassign to:
              </label>
              <select id="reassignToUser" className="form-select">
                {/* <!-- Users will be populated by JavaScript --> */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reassignReason" id="reassignReasonLabel">
                Reason for reassignment:
              </label>
              <textarea
                id="reassignReason"
                rows={4}
                placeholder="Optional reason for reassignment..."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {/* onclick="closeReassignModal()" */}
          <button
            type="button"
            className="btn-secondary"
            id="cancelReassignBtn"
          >
            <i className="fas fa-times"></i>
            <span>Cancel</span>
          </button>
          {/* onclick="confirmReassignment()" */}
          <button type="button" className="btn-primary" id="confirmReassignBtn">
            <i className="fas fa-check"></i>
            <span>Confirm Reassignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReassignTaskModal;
