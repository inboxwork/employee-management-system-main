"use client";
import BackToHomeButton from "@/components/back-to-home-button";
import Toast from "@/components/ui/toast";
import useToast from "@/hooks/use-toast";
import { loginUser } from "@/redux/API/authAPI";
import { useAppDispatch } from "@/redux/hooks";
import { DOMAIN } from "@/utils/constants";
import { validateLogin } from "@/utils/validation";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EmployeeLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const currentLanguage = useLocale() as "ar" | "en";
  const { toast, showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const loadingMessage =
    currentLanguage === "en" ? "Logging in...." : "جاري تسجيل الدخول ...";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = validateLogin({ email, password });
    if (error) return showToast(error.details[0].message, "error");
    try {
      setLoading(true);
      const { data } = await axios.post(`${DOMAIN}/api/auth/login`, { email: email.trim(), password: password.trim() });
      await dispatch(loginUser({ id: data.id, email: data.email, name: data.name, role: data.role, password: data.password }));
      showToast( currentLanguage === "en" ? "Logged in successfully" : "تم تسجيل الدخول بنجاح", "success");
      router.replace("/dashboard/employee");
      setLoading(false);
      router.refresh();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : "an errorr occoured";
      setLoading(false);
      return showToast(errorMessage, "error");
    }
  };

  return (
    <div id="employeeLoginPage" className="container">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <BackToHomeButton />
            <div
              className="logo-icon"
              style={{ fontSize: "32px", color: "#f5576c" }}
            >
              <i className="fas fa-user"></i>
            </div>
          </div>

          <div className="logo-section" style={{ marginBottom: "20px" }}>
            <h1>{t("employeeLogin")}</h1>
            <p className="subtitle">{t("enterYourCredentials")}</p>
          </div>

          <form id="employeeLoginForm" className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employeeEmail">
                <i className="fas fa-envelope"></i>
                <span>{t("emailAddress")}</span>
              </label>
              <input
                type="email"
                id="employeeEmail"
                className="form-control"
                placeholder={t("enterYourEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="employeePassword">
                <i className="fas fa-lock"></i>
                <span>{t("password")}</span>
              </label>
              <input
                type="password"
                id="employeePassword"
                className="form-control"
                placeholder={t("enterYourPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn employee"
              id="employeeLoginBtn"
              disabled={loading}
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>{loading ? loadingMessage : t("loginAsEmployee")}</span>
            </button>
          </form>
        </div>
      </div>
      <Toast toast={toast}/>
    </div>
  );
};

export default EmployeeLogin;
