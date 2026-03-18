"use client";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LoginRule } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const HomePage = () => {
  const router = useRouter();
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const t = useTranslations();
  const [selectedRole, setSelectedRole] = useState<LoginRule | "">("");
  if (loggedInUser) return router.replace(`/dashboard/${loggedInUser.role.toLowerCase()}`);
  return (
    <div className="home">
      <LanguageSwitcher />
      <div id="roleSelectionPage" className="container active">
        <div className="role-selection-container">
          <div className="role-selection-card">
            <div className="logo-section">
              <div className="logo-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h1>{t("appTitle")}</h1>
              <p className="subtitle">{t("selectRole")}</p>
            </div>

            <div className="role-options">
              <div
                className={`role-card ${selectedRole === "manager" && "selected"}`}
                onClick={() => setSelectedRole("manager")}
              >
                <div className="role-icon manager">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="role-title">{t("manager")}</div>
                <div className="role-desc">{t("managerDesc")}</div>
              </div>

              <div
                className={`role-card ${selectedRole === "employee" && "selected"}`}
                onClick={() => setSelectedRole("employee")}
              >
                <div className="role-icon employee">
                  <i className="fas fa-user"></i>
                </div>
                <div className="role-title">{t("employee")}</div>
                <div className="role-desc">{t("employeeDesc")}</div>
              </div>

              <div
                className={`role-card ${selectedRole === "admin" && "selected"}`}
                onClick={() => setSelectedRole("admin")}
              >
                <div className="role-icon admin">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="role-title">{t("admin")}</div>
                <div className="role-desc">{t("adminDesc")}</div>
              </div>
            </div>

            <button
              className="continue-btn"
              id="continueBtn"
              disabled={!selectedRole}
              onClick={() => router.push(`/login/${selectedRole}`)}
            >
              <i className="fas fa-arrow-right"></i>
              <span>{t("continue")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
