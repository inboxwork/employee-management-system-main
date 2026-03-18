import { DOMAIN } from "@/utils/constants";
import { handleRequestError } from "@/utils/handle-errors";
import { validateRegister } from "@/utils/validation";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  openNewManagerModal: boolean;
  setOpenNewManagerModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewManagerAccountModal = ({ openNewManagerModal, setOpenNewManagerModal }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
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
    if (confirmPassword !== createAccountForm.password) return toast.error(t("confirmNewPasswordError"));
    const { error } = validateRegister({
      email: createAccountForm.email,
      name: createAccountForm.name,
      password: createAccountForm.password,
      role: "MANAGER",
    });
    if (error) return toast.error(error.details[0].message);
    const validData = {
      name: createAccountForm.name.trim(),
      email: createAccountForm.email.trim(),
      password: createAccountForm.password.trim(),
      role: "MANAGER",
    };
    try {
      setLoading(true);
      const { data } = await axios.post(`${DOMAIN}/api/auth/register`, validData);
      setLoading(false);
      toast.success(data.message);
      setCreateAccountForm({ email: "", name: "", password: "" });
      setConfirmPassword("");
      setOpenNewManagerModal(false);
    } catch (error) {
      setLoading(false);
      handleRequestError(error, "an error occoured during create account");
    }
  };
  return (
    openNewManagerModal && (
      <div
        id="newManagerModal"
        className={`modal ${openNewManagerModal && "show"}`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="newManagerTitle">{t("newManagerTitle")}</h2>
            <button
              className="close-modal"
              onClick={() => setOpenNewManagerModal(false)}
              disabled={loading}
            >
              &times;
            </button>
          </div>
          <form id="newManagerForm" onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="newManagerName">
                  <i className="fas fa-user"></i>
                  <span id="newManagerNameLabel">
                    {t("newManagerNameLabel")}
                  </span>
                </label>
                <input
                  type="text"
                  id="newManagerName"
                  className="form-control"
                  value={createAccountForm.name}
                  required
                  onChange={(e) => setCreateAccountForm((prev) => ({...prev, name: e.target.value}))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newManagerEmail">
                  <i className="fas fa-envelope"></i>
                  <span id="newManagerEmailLabel">
                    {t("newManagerEmailLabel")}
                  </span>
                </label>
                <input
                  type="email"
                  id="newManagerEmail"
                  className="form-control"
                  value={createAccountForm.email}
                  required
                  onChange={(e) => setCreateAccountForm((prev) => ({...prev, email: e.target.value}))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newManagerPassword">
                    <i className="fas fa-lock"></i>
                    <span id="newManagerPasswordLabel">
                      {t("newManagerPasswordLabel")}
                    </span>
                  </label>
                  <input
                    type="password"
                    id="newManagerPassword"
                    className="form-control"
                    value={createAccountForm.password}
                    required
                    onChange={(e) => setCreateAccountForm((prev) => ({...prev, password: e.target.value}))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmManagerPassword">
                    <i className="fas fa-lock"></i>
                    <span id="confirmManagerPasswordLabel">
                      {t("confirmManagerPasswordLabel")}
                    </span>
                  </label>
                  <input
                    type="password"
                    id="confirmManagerPassword"
                    className="form-control"
                    value={confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                id="cancelNewManagerBtn"
                disabled={loading}
                onClick={() => setOpenNewManagerModal(false)}
              >
                <i className="fas fa-times"></i>
                <span>{t("cancelNewManagerBtn")}</span>
              </button>
              <button
                type="submit"
                className="btn-primary"
                id="createManagerBtn"
                disabled={loading}
              >
                <i className="fas fa-user-plus"></i>
                <span>{loading ? loadingMessage : t("createManagerBtn")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default NewManagerAccountModal;
