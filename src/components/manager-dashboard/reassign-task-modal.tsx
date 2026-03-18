import { getAllUsersData } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Loader from "../ui/loader";
import { validateReassignReason } from "@/utils/validation";
import { toast } from "react-toastify";
import { handleRequestError } from "@/utils/handle-errors";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import { tasksActions } from "@/redux/slices/tasksSlice";
import { fetchSingleTask } from "@/redux/API/tasksAPI";
import { submittedWorksActions } from "@/redux/slices/submittedWorkSlice";

interface Props {
  showReAssignTask: boolean;
  selectedTask: string;
  setShowReAssignTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReassignTaskModal = ({ setShowReAssignTask, showReAssignTask, selectedTask}: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
  const loadingMessage =
    currentLanguage === "en" ? "Confirming" : "جاري التأكيد";
  const { users } = useAppSelector((state) => state.users);
  const { task } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getAllUsersData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSingleTask(selectedTask));
  }, [dispatch, selectedTask]);

  const handleConfirm = async () => {
    const { error } = validateReassignReason({ startDate, endDate, reassignReason: reason });
    if (error) return toast.error(error.details[0].message);
    try {
      setLoading(true);
      const { data } = await axios.put(`${DOMAIN}/api/tasks/reassign/${selectedTask}`, { startDate, endDate, toEmployee: selectedUserId, reassignReason: reason });
      dispatch(tasksActions.setTask(data));
      const submittedWorkResponse = await axios.post(`${DOMAIN}/api/submitted-work`, { ...data, userId: data.userId, fromEmployee: task?.assignedTo.name });
      dispatch(submittedWorksActions.addSubmittedWork(submittedWorkResponse.data));
      setShowReAssignTask(false);
      setLoading(false);
      setReason("");
      setStartDate("");
      setSelectedUserId("");
      setEndDate("");
      toast.success(currentLanguage === "en" ? "Task Reassigned Succeffully" : "تم إعادة تخصيص المهمة بنجاح");
    } catch (error) {
      setLoading(false);
      handleRequestError(error, currentLanguage === "en" ? "An error occured during reassign task" : "حدث خطأ أثناء إعادة تخصيص المهمة");
    }
  };
  return (
    showReAssignTask && (
      <div id="reassignModal" className={`modal ${showReAssignTask && "show"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="reassignTitle">{t("reassignTitle")}</h2>
            <button
              className="close-modal"
              onClick={() => setShowReAssignTask(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="reassign-form">
              <div className="form-group">
                <label htmlFor="reassignToUser" id="reassignToLabel">
                  {t("reassignToLabel")}
                </label>
                <select
                  id="reassignToUser"
                  className="form-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value=""></option>
                  {users &&
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role[0]}
                        {user.role.toLowerCase().slice(1)}
                      </option>
                    ))}
                </select>
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reassignReason" id="reassignReasonLabel">
                  {t("reassignReasonLabel")}
                </label>
                <textarea
                  id="reassignReason"
                  rows={4}
                  placeholder="Optional reason for reassignment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              id="cancelReassignBtn"
              disabled={loading}
              onClick={() => setShowReAssignTask(false)}
            >
              <i className="fas fa-times"></i>
              <span>{t("cancelReassignBtn")}</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              id="confirmReassignBtn"
              disabled={loading}
              onClick={handleConfirm}
              style={{opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "auto"}}
            >
              <i className="fas fa-check"></i>
              <span>
                {loading ? (
                  <Loader text={loadingMessage} />
                ) : (
                  t("confirmReassignBtn")
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ReassignTaskModal;
