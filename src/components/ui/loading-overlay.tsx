import { useTranslations } from "next-intl";

const LoadingOverlay = () => {
  const t = useTranslations();
  return (
    <div id="loadingOverlay" className="loading-overlay">
      <div className="loader">
        <div className="slider"></div>
        <div className="slider"></div>
        <div className="slider"></div>
        <div className="slider"></div>
        <div className="slider"></div>
      </div>
      <div id="loadingText" className="loading-text">
        {t("loading")}
      </div>
    </div>
  );
};

export default LoadingOverlay;
