"use client";
import { getAllUsersData } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

interface Props {
  viewAllUsers: boolean;
  setViewAllUsers: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewUsersModal = ({ viewAllUsers, setViewAllUsers }: Props) => {
  const t = useTranslations();
  const currentLanguage = useLocale() as "en" | "ar";
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllUsersData());
  }, [dispatch]);
  return (
    <div id="viewUsersModal" className={`modal ${viewAllUsers && "show"}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{t("registeredUsers")}</h2>
          <button
            className="close-modal"
            onClick={() => setViewAllUsers(false)}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="user-list" id="usersList">
            {users.length < 1 && (
              <p style={{ textAlign: "center", color: "#64748b" }}>
                No users found.
              </p>
            )}
            {users &&
              users.map((user) => (
                <div key={user.id} className="user-item">
                  <div className="user-header">
                    <div className="user-name">{user.name}</div>
                    <div className="user-type ${user.userType}">
                      {t(user.role.toLowerCase())}
                    </div>
                  </div>
                  <div className="user-details-list">
                    <div className="user-detail-row">
                      <span className="user-detail-label">
                        {currentLanguage === "ar"
                          ? "البريد الإلكتروني:"
                          : "Email:"}
                      </span>
                      <span className="user-detail-value">{user.email}</span>
                    </div>
                    <div className="user-detail-row">
                      <span className="user-detail-label">
                        {currentLanguage === "ar"
                          ? "كلمة المرور:"
                          : "Password:"}
                      </span>
                      <span className="user-detail-value">
                        {user.password}
                      </span>
                    </div>
                    <div className="user-detail-row">
                      <span className="user-detail-label">
                        {currentLanguage === "ar"
                          ? "تاريخ الإنشاء:"
                          : "Account Created:"}
                      </span>
                      <span className="user-detail-value">
                        {(new Date(user.createdAt).toLocaleString())}
                      </span>
                    </div>
                    <div className="user-detail-row">
                      <span className="user-detail-label">
                        {currentLanguage === "ar"
                          ? "تم الإنشاء بواسطة:"
                          : "Created By:"}
                      </span>
                      <span className="user-detail-value">
                        {/* TODO */}
                        Created By 
                      </span>
                    </div>
                    <div className="user-detail-row">
                      <span className="user-detail-label">
                        {currentLanguage === "ar" ? "آخر دخول:" : "Last Login:"}
                      </span>
                      <span className="user-detail-value">
                        {/* ${lastLoginDate} */}
                        Last Login
                      </span>
                    </div>
                    <div className="user-detail-row">
                      <span className="user-detail-label">
                        {currentLanguage === "ar"
                          ? "عدد مرات الدخول:"
                          : "Login Count:"}
                      </span>
                      <span className="user-detail-value">
                        {0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setViewAllUsers(false)}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUsersModal;
