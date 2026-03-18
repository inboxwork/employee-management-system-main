import { TabsNavigationTypes } from "@/utils/types";
import { useTranslations } from "next-intl";

interface Props {
  currentTab: TabsNavigationTypes;
  setCurrentTab: React.Dispatch<React.SetStateAction<TabsNavigationTypes>>;
}

const TabsNavigation = ({ currentTab, setCurrentTab }: Props) => {
  const t = useTranslations("managerDashboardPage");
  return (
    <div className="tabs">
      <button
        className={`tab-btn ${currentTab === "all-tasks" && "active"}`}
        onClick={() => setCurrentTab("all-tasks")}
      >
        <i className="fas fa-tasks"></i>
        <span id="tabAllTasks">{t("tabAllTasks")}</span>
      </button>
      <button
        className={`tab-btn ${currentTab === "submitted-work" && "active"}`}
        onClick={() => setCurrentTab("submitted-work")}
      >
        <i className="fas fa-paper-plane"></i>
        <span id="tabSubmittedWork">{t("tabSubmittedWork")}</span>
      </button>
      <button
        className={`tab-btn ${currentTab === "users" && "active"}`}
        onClick={() => setCurrentTab("users")}
      >
        <i className="fas fa-users"></i>
        <span id="tabUsers">{t("tabUsers")}</span>
      </button>
      <button
        className={`tab-btn ${currentTab === "archive" && "active"}`}
        onClick={() => setCurrentTab("archive")}
      >
        <i className="fas fa-archive"></i>
        <span id="tabArchive">{t("tabArchive")}</span>
      </button>
    </div>
  );
};

export default TabsNavigation;
