import { getAllUsersData } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submittedWorksActions } from "@/redux/slices/submittedWorkSlice";
import { tasksActions } from "@/redux/slices/tasksSlice";
import { DOMAIN } from "@/utils/constants";
import { formatFileSize, getFileIcon } from "@/utils/formatters";
import { handleRequestError } from "@/utils/handle-errors";
import { Currency, Task, TaskPriority, UploadedFile } from "@/utils/types";
import { validateAddTask } from "@/utils/validation";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  showNewTaskModal: boolean;
  setShowNewTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewTaskModal = ({ showNewTaskModal, setShowNewTaskModal }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
  const loadingMessage =
    currentLanguage === "en" ? "Adding Task..." : "جاري إضافة المهمة";
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [selectedAttachements, setSelectedAttachements] = useState<
    UploadedFile[]
  >([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "LOW",
    startDate: "",
    endDate: "",
    price: 0,
    currency: "USD",
  });
  const [selectUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);
  useEffect(() => {
    dispatch(getAllUsersData());
  }, [dispatch]);
  function handleNewTaskFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    if (selectedAttachements.length + files.length > 10) {
      toast.error(t("maxFilesExceeded"));
      return;
    }

    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} - ${t("fileTooLarge")}`);
        return;
      }

      newFiles.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    setSelectedAttachements((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  }
  function removeFile(index: number) {
    setSelectedAttachements((prev) => prev.filter((_, i) => i !== index));
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = validateAddTask({ ...newTask });
    if (error) return toast.error(error.details[0].message);
    const formData = new FormData();
    formData.append("title", newTask.title?.trim() as string);
    formData.append("description", newTask.description?.trim() as string);
    formData.append("startDate", newTask.startDate?.trim() as string);
    formData.append("endDate", newTask.endDate?.trim() as string);
    formData.append("priority", newTask.priority as string);
    formData.append("currency", newTask.currency as string);
    formData.append("userId", selectUserId as string);
    formData.append("price", String(newTask.price));
    selectedAttachements.forEach((attachment) => {
      formData.append("attachments", attachment.file);
    });
    try {
      setLoading(true);
      const { data } = await axios.post(`${DOMAIN}/api/tasks`, formData);
      const submittedWorkResponse = await axios.post(`${DOMAIN}/api/submitted-work`, { ...data, fromEmployee: data.assignedBy });
      dispatch(tasksActions.addTask(data));
      dispatch(submittedWorksActions.addSubmittedWork(submittedWorkResponse.data));
      setNewTask({
        title: "",
        description: "",
        priority: "LOW",
        startDate: "",
        endDate: "",
        price: 0,
        currency: "USD",
      });
      setSelectedAttachements([]);
      setLoading(false);
      toast.success(currentLanguage === "en" ? "Task Created Succeffully" : "تم إنشاء المهمة بنجاح");
      setShowNewTaskModal(false);
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء إنشاء مهمة جديدة");
    }
  };
  return (
    showNewTaskModal && (
      <div id="newTaskModal" className={`modal ${showNewTaskModal && "show"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="newTaskTitle">{t("newTaskTitle")}</h2>
            <button
              className="close-modal"
              onClick={() => {
                setShowNewTaskModal(false);
              }}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <form id="newTaskForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newTaskName">
                  <i className="fas fa-heading"></i>
                  <span id="newTaskNameLabel">{t("newTaskNameLabel")}</span>
                </label>
                <input
                  type="text"
                  id="newTaskName"
                  className="form-control"
                  value={newTask.title}
                  required
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="newTaskDescription">
                  <i className="fas fa-align-left"></i>
                  <span id="newTaskDescLabel">{t("newTaskDescLabel")}</span>
                </label>
                <textarea
                  id="newTaskDescription"
                  className="form-control"
                  value={newTask.description}
                  rows={4}
                  required
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newTaskAssignTo">
                    <i className="fas fa-user"></i>
                    <span id="newTaskAssignToLabel">
                      {t("newTaskAssignToLabel")}
                    </span>
                  </label>
                  <select
                    id="newTaskAssignTo"
                    className="form-select"
                    required
                    value={selectUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value=""></option>
                    {users &&
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role.toLowerCase()}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="newTaskPriority">
                    <i className="fas fa-exclamation-circle"></i>
                    <span id="newTaskPriorityLabel">
                      {t("newTaskPriorityLabel")}
                    </span>
                  </label>
                  <select
                    id="newTaskPriority"
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        priority: e.target.value as TaskPriority,
                      }))
                    }
                  >
                    <option value="LOW" id="newTaskPriorityLow">
                      {t("newTaskPriorityLow")}
                    </option>
                    <option value="MEDIUM" id="newTaskPriorityMedium">
                      {t("newTaskPriorityMedium")}
                    </option>
                    <option value="HIGH" id="newTaskPriorityHigh">
                      {t("newTaskPriorityHigh")}
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newTaskStartDate">
                    <i className="fas fa-calendar"></i>
                    <span id="newTaskStartDateLabel">
                      {t("newTaskStartDateLabel")}
                    </span>
                  </label>
                  <input
                    type="date"
                    id="newTaskStartDate"
                    className="form-control"
                    value={newTask.startDate}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newTaskEndDate">
                    <i className="fas fa-calendar-check"></i>
                    <span id="newTaskEndDateLabel">
                      {t("newTaskEndDateLabel")}
                    </span>
                  </label>
                  <input
                    type="date"
                    id="newTaskEndDate"
                    className="form-control"
                    value={newTask.endDate}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newTaskPrice">
                    <i className="fas fa-dollar-sign"></i>
                    <span id="newTaskPriceLabel">{t("newTaskPriceLabel")}</span>
                  </label>
                  <input
                    type="number"
                    id="newTaskPrice"
                    className="form-control"
                    placeholder="Optional"
                    min={0}
                    step="0.01"
                    value={newTask.price}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        price: +e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newTaskCurrency">
                    <i className="fas fa-money-bill-wave"></i>
                    <span id="newTaskCurrencyLabel">
                      {t("newTaskCurrencyLabel")}
                    </span>
                  </label>
                  <select
                    id="newTaskCurrency"
                    className="form-control"
                    value={newTask.currency}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        currency: e.target.value as Currency,
                      }))
                    }
                  >
                    <option value="USD">🇺🇸 USD (Dollar)</option>
                    <option value="EUR">🇪🇺 EUR (Euro)</option>
                    <option value="EGP">🇪🇬 EGP (Egyptian Pound)</option>
                    <option value="AED">🇦🇪 AED (Dirham)</option>
                    <option value="SAR">🇸🇦 SAR (Riyal)</option>
                    <option value="GBP">🇬🇧 GBP (Pound)</option>
                  </select>
                </div>
              </div>

              {/* <!-- File Upload Section --> */}
              <div className="file-upload-section">
                <div className="form-group">
                  <label htmlFor="taskFiles">
                    <i className="fas fa-paperclip"></i>
                    <span id="taskFilesLabel">{t("taskFilesLabel")}</span>
                  </label>
                  <div
                    className="file-upload-area"
                    onClick={() => inputRef.current!.click()}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p className="file-upload-text" id="uploadText">
                      {t("uploadText")}
                    </p>
                    <p className="file-upload-hint" id="uploadTypes">
                      {t("uploadTypes")}
                    </p>
                    <input
                      type="file"
                      id="taskFileInput"
                      multiple
                      style={{ display: "none" }}
                      ref={inputRef}
                      onChange={handleNewTaskFileUpload}
                    />
                  </div>

                  <div className="file-uploaded-list" id="newTaskUploadedFiles">
                    {selectedAttachements.length > 0 &&
                      selectedAttachements.map((file, index) => (
                        <div key={index} className="file-uploaded-item">
                          <div className="file-uploaded-info">
                            <div className="file-uploaded-icon">
                              <i
                                className={`fas fa-${getFileIcon(file.name)}`}
                              ></i>
                            </div>

                            <div>
                              <div className="file-uploaded-name">
                                {file.name}
                              </div>
                              <div className="file-uploaded-size">
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="file-remove-btn"
                            onClick={() => removeFile(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  id="cancelNewTaskBtn"
                  onClick={() => setShowNewTaskModal(false)}
                  disabled={loading}
                >
                  <i className="fas fa-times"></i>
                  <span>{t("cancelNewTaskBtn")}</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  id="assignNewTaskBtn"
                  disabled={loading}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>
                    {loading ? loadingMessage : t("assignNewTaskBtn")}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default NewTaskModal;
