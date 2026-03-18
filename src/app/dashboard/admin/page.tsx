"use client";
import LogoutButton from "@/components/logout-button";
import { getUserProfile } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboard = () => {
  const t = useTranslations();
  const router = useRouter();
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (loggedInUser) {
      dispatch(getUserProfile(loggedInUser.id));
    }
  }, [dispatch, loggedInUser]);
  if (!loggedInUser) return router.replace("/");
  if (loggedInUser.role !== "ADMIN") return router.replace(`/dashboard/${loggedInUser.role.toLowerCase()}`);
  return (
    <div id="adminDashboard" className="container">
      <div className="user-dashboard-container">
        <div className="user-dashboard-card">
          <div className="login-header">
            <LogoutButton />
            <div
              className="logo-icon"
              style={{ fontSize: "32px", color: "#10b981" }}
            >
              <i className="fas fa-user-shield"></i>
            </div>
          </div>

          <div className="user-info">
            <div className="user-avatar" id="adminAvatar">
              {loggedInUser.name.slice(0, 1)}
            </div>
            <h1 id="adminName">{t("adminDashboard")}</h1>
            <p className="subtitle" id="adminWelcome">
              {t("welcomeBackAdmin")}
            </p>
          </div>

          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">{t("email")}</span>
              <span className="detail-value" id="adminEmailDetail">
                {loggedInUser.email}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("userType")}</span>
              <span className="detail-value">{t("administratorType")}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("accountCreated")}</span>
              <span className="detail-value" id="adminCreatedDate">
                {(new Date(user?.createdAt as string)).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("createdBy")}</span>
              <span className="detail-value" id="adminCreatedBy">
                System
              </span>
            </div>
          </div>

          <Link href="/admin">
            <button className="login-btn admin" style={{ marginTop: "30px" }}>
              <i className="fas fa-cogs"></i>
              <span>{t("accessControlPanel")}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
