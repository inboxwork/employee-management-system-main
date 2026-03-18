"use client";
import { deleteUserData, getAllUsersData } from "@/redux/API/usersAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TabsNavigationTypes, User } from "@/utils/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  currentTab: TabsNavigationTypes;
  setShowEditUserData: React.Dispatch<React.SetStateAction<boolean>>;
  setEditUserDataForm: React.Dispatch<React.SetStateAction<Partial<User>>>;
}

const UsersSection = ({ currentTab, setShowEditUserData, setEditUserDataForm }: Props) => {
  const t = useTranslations("managerDashboardPage");
  const currentLanguage = useLocale() as "en" | "ar";
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const [roleFilter, setRoleFilter] = useState("all");
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return roleFilter === "all" || user.role === roleFilter;
    });
  }, [roleFilter, users]);
  useEffect(() => {
    dispatch(getAllUsersData());
  }, [dispatch]);
  const handleDelete = (user: User) => {
    if (user.id === loggedInUser?.id) return toast.error(t("cannotDeleteSystemManager"));
    if (!confirm(t("deleteUserConfirm"))) return;
    dispatch(deleteUserData(user.id));
    toast.success(currentLanguage === "en" ? `User "${user.name}" Deleted Succefully` : `تم حذف المستخدم "${user.name}" بنجاح`);
  }
  const handleEdit = (user: User) => {
    setShowEditUserData(true);
    setEditUserDataForm(user);
  }
  return (
    currentTab === "users" && (
      <div
        id="users"
        className={`section ${currentTab === "users" && "active"}`}
      >
        <div className="section-header">
          <h2>
            <i className="fas fa-users"></i>{" "}
            <span id="usersTitle">{t("usersTitle")}</span>
          </h2>
          <div className="filter-controls">
            <select
              id="userTypeFilter"
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all" id="filterAllTypes">
                {t("filterAllTypes")}
              </option>
              <option value="MANAGER" id="filterManagers">
                {t("filterManagers")}
              </option>
              <option value="EMPLOYEE" id="filterEmployees">
                {t("filterEmployees")}
              </option>
              <option value="ADMIN" id="filterAdmins">
                {t("filterAdmins")}
              </option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th id="userNameHeader">{t("userNameHeader")}</th>
                <th id="userEmailHeader">{t("userEmailHeader")}</th>
                <th id="userTypeHeader">{t("userTypeHeader")}</th>
                <th id="userActionsHeader">{t("userActionsHeader")}</th>
              </tr>
            </thead>
            <tbody id="usersTable">
              {(users.length < 1 || filteredUsers.length < 1) && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <i className="fas fa-users"></i>
                      <h3>{t("noUsersFound")}</h3>
                      <p>
                        {users.length === 0
                          ? "No users found in the system. Start by creating a new manager account."
                          : "No users match your filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredUsers.length > 0 &&
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: "600", color: "#1e293b" }}>
                      {user.name}
                    </td>
                    <td style={{ color: "#475569" }}>{user.email}</td>
                    <td>
                      <span
                        className={`badge badge-${user.role?.toLowerCase()}`}
                      >
                        {t(
                          `userType${user.role?.toLowerCase().charAt(0).toUpperCase() + user.role?.toLowerCase().slice(1)}`,
                        )}
                      </span>
                    </td>
                    <td>
                      <div
                        className="action-buttons"
                        style={{ flexDirection: "row", minWidth: "auto" }}
                      >
                        <button
                          className="action-btn edit"
                          title="${t.actionEdit}"
                          onClick={() => handleEdit(user)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {loggedInUser?.email !== user.email && (
                          <button
                            className="action-btn delete"
                            title="${t.actionDelete}"
                            disabled={user.email === "manager@email.com"}
                            onClick={() => handleDelete(user)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default UsersSection;
