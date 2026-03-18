"use client";
import LanguageSwitcher from "@/components/language-switcher";
import LogoutButton from "@/components/logout-button";
import { getUserProfile } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EmployeeDashboard = () => {
  const router = useRouter();
  const t = useTranslations();
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
    useEffect(() => {
    if (loggedInUser) {
      dispatch(getUserProfile(loggedInUser.id));
    }
  }, [dispatch, loggedInUser]);
  if (!loggedInUser) return router.replace("/");
  if (loggedInUser.role !== "EMPLOYEE") return router.replace(`/${loggedInUser?.role?.toLowerCase()}`);
  return (
    <>
      <LanguageSwitcher />
      <div id="employeeDashboard" className="container">
        <div className="user-dashboard-container">
          <div className="user-dashboard-card">
            <div className="login-header">
              <LogoutButton />
              <div
                className="logo-icon"
                style={{ fontSize: "32px", color: "#f5576c" }}
              >
                <i className="fas fa-user"></i>
              </div>
            </div>

            <div className="user-info">
              <div className="user-avatar" id="employeeAvatar">
                {loggedInUser.name.slice(0, 1)}
              </div>
              <h1 id="employeeName">{t("employeeDashboard")}</h1>
              <p className="subtitle" id="employeeWelcome" dir="auto">
                {t("welcomeBack")}
              </p>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <span className="detail-label">{t("email")}</span>
                <span className="detail-value" id="employeeEmailDetail">
                  {loggedInUser.email}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t("userType")}</span>
                <span className="detail-value">{t("employeeType")}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t("accountCreated")}</span>
                <span className="detail-value" id="employeeCreatedDate">
                  {new Date(user?.createdAt as string).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t("createdBy")}</span>
                <span className="detail-value" id="employeeCreatedBy">
                  Manager
                </span>
              </div>
            </div>
            <Link href="/employee">
              <button
                className="login-btn employee"
                style={{ marginTop: "30px" }}
              >
                <i className="fas fa-tasks"></i>
                <span>{t("accessWorkPanel")}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
