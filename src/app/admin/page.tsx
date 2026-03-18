"use client";
import LanguageSwitcher from "@/components/language-switcher";
import AdminHeader from "@/components/admin/admin-header";
import AdminTabsNavigation from "@/components/admin/admin-tabs-navigation";
import AdminAllTasks from "@/components/admin/admin-all-tasks";
import AdminUsersSection from "@/components/admin/admin-users-section";
import AdminArchiveSection from "@/components/admin/admin-archive-section";
import LogoutButton from "../manager-dashboard/logout-button";
import AdminTaskDetailsModal from "@/components/admin/admin-task-details-modal";
import "../manager-dashboard/manager.css";
import "./admin.css";
import { SubmittedWork as SubmittedWorkType, TabsNavigationTypes } from "@/utils/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import NewTaskModal from "@/components/manager-dashboard/new-task-modal";
import ReassignTaskModal from "@/components/manager-dashboard/reassign-task-modal";
import AdminSubmittedWorkSection from "@/components/admin/admin-submitted-work-section";
import TaskSubmissionDetailsModal from "@/components/manager-dashboard/task-submission-details-modal";

const AdminPage = () => {
  const router = useRouter();
  const { loggedInUser } = useAppSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState<TabsNavigationTypes>("all-tasks");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [showViewTask, setShowViewTask] = useState(false);
  const [showReAssignTask, setShowReAssignTask] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Partial<SubmittedWorkType>>({});
  if (!loggedInUser) return router.replace("/");
  if (loggedInUser.role !== "ADMIN") return router.replace(`/dashboard/${loggedInUser.role.toLowerCase()}`);
  return (
    <>
      <LanguageSwitcher />
      <div className="container">
        <AdminHeader />
        <AdminTabsNavigation {...{currentTab, setCurrentTab}}/>
        <AdminAllTasks {...{currentTab, setShowNewTaskModal, setSelectedTask, setShowViewTask, setShowReAssignTask}} />
        <AdminUsersSection {...{ currentTab }} />
        <AdminSubmittedWorkSection {...{currentTab, setSelectedSubmission, setShowSubmission}} />
        <AdminArchiveSection {...{currentTab, setShowViewTask, setSelectedTask}} />
      </div>
      <AdminTaskDetailsModal  {...{selectedTask, showViewTask, setShowViewTask}} />
      <NewTaskModal {...{setShowNewTaskModal, showNewTaskModal}} />
      <ReassignTaskModal {...{ selectedTask, setShowReAssignTask, showReAssignTask }} />
      <TaskSubmissionDetailsModal {...{selectedSubmission, setShowSubmission, showSubmission}} />
      <LogoutButton />
    </>
  );
};

export default AdminPage;
