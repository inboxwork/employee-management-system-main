import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { authActions } from "@/redux/slices/authSlice";
import { usersActions } from "@/redux/slices/usersSlice";
import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { validateChangePassword } from "@/utils/validation";
import axios from "axios";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  showChangePasswordModal: boolean;
  setShowChangePasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePasswordModal = ({ showChangePasswordModal, setShowChangePasswordModal }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  if (!loggedInUser) return redirect("/");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmNewPassword !== newPassword)
      return toast.error(t("confirmNewPasswordError"));
    const { error } = validateChangePassword({ newPassword });
    if (error) return toast.error(error.details[0].message);
    try {
      setLoading(true);
      const { data } = await axios.put(`${DOMAIN}/api/users/change-password/${loggedInUser?.id}`, { oldPassword, newPassword });
      dispatch(usersActions.updateUserData(data));
      dispatch(authActions.setPassword(data));
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
        }),
      );
      setShowChangePasswordModal(false);
      toast.success("تم تغيير كلمة المرور بنجاح");
      setLoading(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      handleRequestError(error, "حدث خطأ أثناء تغيير كلمة المرور");
      setLoading(false);
    }
  };

  return (
    showChangePasswordModal && (
      <div
        id="changePasswordModal"
        className={`modal ${showChangePasswordModal && "show"}`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="changePasswordTitle">{t("changePasswordTitle")}</h2>
            <button
              className="close-modal"
              onClick={() => {
                setShowChangePasswordModal(false);
              }}
            >
              &times;
            </button>
          </div>
          <form id="changePasswordForm" onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="currentPassword">
                  <i className="fas fa-lock"></i>
                  <span id="currentPasswordLabel">
                    {t("currentPasswordLabel")}
                  </span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="form-control"
                  value={oldPassword}
                  required
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  <i className="fas fa-key"></i>
                  <span id="newPasswordLabel">{t("newPasswordLabel")}</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPassword">
                  <i className="fas fa-key"></i>
                  <span id="confirmNewPasswordLabel">
                    {t("confirmNewPasswordLabel")}
                  </span>
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="form-control"
                  value={confirmNewPassword}
                  required
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                id="cancelChangePasswordBtn"
                disabled={loading}
                onClick={() => {
                  setShowChangePasswordModal(false);
                }}
              >
                <i className="fas fa-times"></i>
                <span>{t("cancelChangePasswordBtn")}</span>
              </button>
              <button
                type="submit"
                className="btn-primary"
                id="savePasswordBtn"
                disabled={loading}
              >
                <i className="fas fa-save"></i>
                <span>
                  {loading ? t("changePasswordLoading") : t("savePasswordBtn")}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ChangePasswordModal;
