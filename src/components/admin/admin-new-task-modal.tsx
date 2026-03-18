const AdminNewTaskModal = () => {
  return (
    <div id="newTaskModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="newTaskTitle">Assign New Task</h2>
          {/* onclick="closeNewTaskModal()" */}
          <button className="close-modal">&times;</button>
        </div>
        <form id="newTaskForm">
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="newTaskName">
                <i className="fas fa-heading"></i>
                <span id="newTaskNameLabel">Task Title</span>
              </label>
              <input
                type="text"
                id="newTaskName"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newTaskDescription">
                <i className="fas fa-align-left"></i>
                <span id="newTaskDescLabel">Description</span>
              </label>
              <textarea
                id="newTaskDescription"
                className="form-control"
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newTaskAssignTo">
                  <i className="fas fa-user"></i>
                  <span id="newTaskAssignToLabel">Assign To</span>
                </label>
                <select id="newTaskAssignTo" className="form-select" required>
                  {/* <!-- Users will be populated by JavaScript --> */}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="newTaskPriority">
                  <i className="fas fa-exclamation-circle"></i>
                  <span id="newTaskPriorityLabel">Priority</span>
                </label>
                <select id="newTaskPriority" className="form-select">
                  <option value="low" id="newTaskPriorityLow">
                    Low
                  </option>
                  <option value="medium" id="newTaskPriorityMedium">
                    Medium
                  </option>
                  <option value="high" id="newTaskPriorityHigh">
                    High
                  </option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newTaskStartDate">
                  <i className="fas fa-calendar"></i>
                  <span id="newTaskStartDateLabel">Start Date</span>
                </label>
                <input
                  type="date"
                  id="newTaskStartDate"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newTaskEndDate">
                  <i className="fas fa-calendar-check"></i>
                  <span id="newTaskEndDateLabel">End Date</span>
                </label>
                <input
                  type="date"
                  id="newTaskEndDate"
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* <!-- Budget Field --> */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newTaskBudget">
                  <i className="fas fa-money-bill"></i>
                  <span id="newTaskBudgetLabel">Budget</span>
                </label>
                <div className="budget-field">
                  <input
                    type="number"
                    id="newTaskBudget"
                    className="budget-input"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                  <select id="newTaskCurrency" className="currency-select">
                    <option value="USD">🇺🇸 USD</option>
                    <option value="EUR">🇪🇺 EUR</option>
                    <option value="GBP">🇬🇧 GBP</option>
                    <option value="EGP">🇪🇬 EGP</option>
                    <option value="SAR">🇸🇦 SAR</option>
                    <option value="AED">🇦🇪 AED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* <!-- File Upload Section --> */}
            <div className="file-upload-section">
              <div className="form-group">
                <label htmlFor="taskFiles">
                  <i className="fas fa-paperclip"></i>
                  <span id="taskFilesLabel">Attachments (Optional)</span>
                </label>
                {/* onclick="document.getElementById('taskFileInput').click()" */}
                <div className="file-upload-area">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p className="file-upload-text" id="uploadText">
                    Click to upload files or drag and drop
                  </p>
                  <p className="file-upload-hint" id="uploadTypes">
                    PDF, DOC, DOCX, JPG, PNG, ZIP (Max 10MB each)
                  </p>
                  {/* onchange="handleNewTaskFileUpload(this.files)" */}
                  <input
                    type="file"
                    id="taskFileInput"
                    multiple
                    style={{ display: "none" }}
                  />
                </div>

                <div className="file-uploaded-list" id="newTaskUploadedFiles">
                  {/* <!-- Uploaded files will appear here --> */}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {/* onclick="closeNewTaskModal()" */}
            <button
              type="button"
              className="btn-secondary"
              id="cancelNewTaskBtn"
            >
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button type="submit" className="btn-primary" id="assignNewTaskBtn">
              <i className="fas fa-paper-plane"></i>
              <span>Assign Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewTaskModal;
