"use client";

import { EditUserData, User, UserRole } from "@/utils/types";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Loader from "../ui/loader";
import { validateEditUserData } from "@/utils/validation";
import { toast } from "react-toastify";
import { handleRequestError } from "@/utils/handle-errors";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import { useAppDispatch } from "@/redux/hooks";
import { usersActions } from "@/redux/slices/usersSlice";

interface Props {
  showEditUserData: boolean;
  editUserDataForm: Partial<User>;
  setShowEditUserData: React.Dispatch<React.SetStateAction<boolean>>;
  setEditUserDataForm: React.Dispatch<React.SetStateAction<Partial<User>>>;
}

const EditUserModal = ({ showEditUserData, setShowEditUserData, editUserDataForm, setEditUserDataForm }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (editUserDataForm) {
      if (confirmPassword !== newPassword) return toast.error(t("confirmNewPasswordError"))
      const { name, role } = editUserDataForm;
      let newData: EditUserData = { name: name!, role: role! };
      if (newPassword.trim()) {
        newData = { name: name!, role: role!, password: newPassword };
      }
      const { error } = validateEditUserData(newData);
      if (error) return toast.error(error.details[0].message);
      try {
        setLoading(true);
        const { data } = await axios.put(`${DOMAIN}/api/users/${editUserDataForm.id}`, { ...newData });
        dispatch(usersActions.updateUserData(data));
        setLoading(false);
        setShowEditUserData(false);
        toast.success(currentLanguage === "en" ? `User data "${editUserDataForm.name}" Updated Successfully` : `تم تحديث بيانات المستخدم "${editUserDataForm.name}" بنجاح`);
        setEditUserDataForm({});
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        handleRequestError(error, currentLanguage === "en" ? "An error occurred during edit user data" : "حدث خطأ أثناء تعديل بيانات المستخدم");
        setLoading(false);
      }
    }
  };
  return (
    showEditUserData && (
      <div id="editUserModal" className={`modal ${showEditUserData && "show"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="editUserTitle">{t("editUserTitle")}</h2>
            <button
              className="close-modal"
              onClick={() => setShowEditUserData(false)}
            >
              &times;
            </button>
          </div>
          <form id="editUserForm" onSubmit={handleSubmit}>
            <div className="modal-body">
              <input type="hidden" id="editUserId" />
              <input type="hidden" id="editUserEmail" />

              <div className="form-group">
                <label htmlFor="editUserName">Full Name</label>
                <input
                  type="text"
                  id="editUserName"
                  className="form-control"
                  value={editUserDataForm?.name}
                  onChange={(e) =>
                    setEditUserDataForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editUserType">User Type</label>
                <select
                  id="editUserType"
                  className="form-control"
                  required
                  value={editUserDataForm?.role}
                  onChange={(e) =>
                    setEditUserDataForm((prev) => ({
                      ...prev,
                      role: e.target.value as UserRole,
                    }))
                  }
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              <div id="passwordFields">
                <div className="form-group">
                  <label htmlFor="editUserPassword">
                    New Password (leave empty to keep current)
                  </label>
                  <input
                    type="password"
                    id="editUserPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmEditPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmEditPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditUserData(false)}
                  disabled={loading}
                >
                  <i className="fas fa-times"></i>
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{
                    cursor: loading ? "not-allowed" : "auto",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <i className="fas fa-save"></i>
                  <span>{loading ? <Loader text="Saving Changes "/> : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditUserModal;
