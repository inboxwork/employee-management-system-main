"use client";
import { useAppDispatch } from "@/redux/hooks";
import { usersActions } from "@/redux/slices/usersSlice";
import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { UserRole } from "@/utils/types";
import { validateRegister } from "@/utils/validation";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateAccountModal = ({ title, isOpen, setIsOpen }: Props) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const currentLanguage = useLocale() as "en" | "ar";
  const newUserRole: UserRole = title === "admin" ? "ADMIN" : "EMPLOYEE";
  const [createAccountForm, setCreateAccountForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const loadingMessage = currentLanguage === "en" ? "Creating Account..." : "جاري إنشاء الحساب ...";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(createAccountForm);
    if (confirmPassword !== createAccountForm.password) return toast.error(t("passwordMismatch"));
    const { error } = validateRegister({email: createAccountForm.email, name: createAccountForm.name, password: createAccountForm.password, role: newUserRole});
    if (error) return toast.error(error.details[0].message);
    const validData = { name: createAccountForm.name.trim(), email: createAccountForm.email.trim(), password: createAccountForm.password.trim(), role: newUserRole };
    try {
      setLoading(true);
      const { data }= await axios.post(`${DOMAIN}/api/auth/register`, validData);
      setLoading(false);
      dispatch(usersActions.addUser(data));
      toast.success(data.message);
      setCreateAccountForm({ email: "", name: "", password: "" });
      setConfirmPassword("");
    } catch (error) {
      setLoading(false);
      handleRequestError(error, "an error occoured during create account");
    }
  }
  return isOpen && (
    <div id="createAccountModal" className={`modal ${isOpen && "show"}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modalTitle">{t("createNewAccount")} - {t(title)}</h2>
          <button className="close-modal" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        <form id="createAccountForm" onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="createUserName">{t("fullName")}</label>
              <input
                type="text"
                id="createUserName"
                className="form-control"
                placeholder={t("enterFullName")}
                value={createAccountForm.name}
                onChange={(e) => setCreateAccountForm((prev) => ({...prev, name: e.target.value}))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="createUserEmail">{t("emailAddress")}</label>
              <input
                type="email"
                id="createUserEmail"
                className="form-control"
                placeholder={t("enterEmailAddress")}
                value={createAccountForm.email}
                onChange={(e) => setCreateAccountForm((prev) => ({...prev, email: e.target.value}))}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="createUserPassword">{t("password")}</label>
                <input
                  type="password"
                  id="createUserPassword"
                  className="form-control"
                  placeholder={t("enterPassword")}
                  value={createAccountForm.password}
                onChange={(e) => setCreateAccountForm((prev) => ({...prev, password: e.target.value}))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmUserPassword">
                  {t("confirmPassword")}
                </label>
                <input
                  type="password"
                  id="confirmUserPassword"
                  className="form-control"
                  placeholder={t("confirmYourPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <input type="hidden" id="createUserType" value="" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              {t("cancel")}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? loadingMessage : t("createAccount")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;
